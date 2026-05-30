import { and, asc, desc, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '@/db/client';
import {
  exercises,
  routineExercises,
  routineSets,
  routines,
  sets,
  workoutExercises,
  workouts,
} from '@/db/schema';

export type WorkoutDetail = {
  id: number;
  name: string;
  startedAt: Date;
  exercises: {
    workoutExerciseId: number;
    exerciseId: number;
    exerciseName: string;
    restSec: number | null;
    sets: {
      id: number;
      position: number;
      weight: number;
      reps: number;
      isDone: boolean;
    }[];
  }[];
};

export type ActiveWorkoutSummary = {
  id: number;
  name: string;
  startedAt: Date;
};

export async function getActiveWorkout(): Promise<ActiveWorkoutSummary | null> {
  const result = await db
    .select({
      id: workouts.id,
      name: workouts.name,
      startedAt: workouts.startedAt,
    })
    .from(workouts)
    .where(isNull(workouts.finishedAt))
    .orderBy(desc(workouts.startedAt))
    .limit(1);
  return result.at(0) ?? null;
}

export async function startWorkoutFromRoutine(routineId: number): Promise<number> {
  return db.transaction(async (tx) => {
    const [routine] = await tx
      .select()
      .from(routines)
      .where(eq(routines.id, routineId))
      .limit(1);
    if (!routine) throw new Error('Rutyna nie istnieje');

    const [created] = await tx
      .insert(workouts)
      .values({ name: routine.name, routineId: routine.id })
      .returning({ id: workouts.id });
    const workoutId = created.id;

    const re = await tx
      .select()
      .from(routineExercises)
      .where(eq(routineExercises.routineId, routineId))
      .orderBy(asc(routineExercises.position));

    for (const r of re) {
      const [we] = await tx
        .insert(workoutExercises)
        .values({
          workoutId,
          exerciseId: r.exerciseId,
          position: r.position,
          restSec: r.restSec,
        })
        .returning({ id: workoutExercises.id });

      const planned = await tx
        .select()
        .from(routineSets)
        .where(eq(routineSets.routineExerciseId, r.id))
        .orderBy(asc(routineSets.position));

      if (planned.length > 0) {
        await tx.insert(sets).values(
          planned.map((p) => ({
            workoutExerciseId: we.id,
            position: p.position,
            weight: p.targetWeight ?? 0,
            reps: p.targetReps ?? 0,
            isDone: false,
          })),
        );
      }
    }

    return workoutId;
  });
}

export async function getWorkoutDetail(id: number): Promise<WorkoutDetail | null> {
  const [workout] = await db.select().from(workouts).where(eq(workouts.id, id)).limit(1);
  if (!workout) return null;

  const we = await db
    .select({
      workoutExerciseId: workoutExercises.id,
      exerciseId: workoutExercises.exerciseId,
      exerciseName: exercises.name,
      restSec: workoutExercises.restSec,
    })
    .from(workoutExercises)
    .innerJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .where(eq(workoutExercises.workoutId, id))
    .orderBy(asc(workoutExercises.position));

  const weIds = we.map((w) => w.workoutExerciseId);
  const allSets =
    weIds.length === 0
      ? []
      : await db
          .select()
          .from(sets)
          .where(inArray(sets.workoutExerciseId, weIds))
          .orderBy(asc(sets.position));

  return {
    id: workout.id,
    name: workout.name,
    startedAt: workout.startedAt,
    exercises: we.map((w) => ({
      workoutExerciseId: w.workoutExerciseId,
      exerciseId: w.exerciseId,
      exerciseName: w.exerciseName,
      restSec: w.restSec,
      sets: allSets
        .filter((s) => s.workoutExerciseId === w.workoutExerciseId)
        .map((s) => ({
          id: s.id,
          position: s.position,
          weight: s.weight,
          reps: s.reps,
          isDone: s.isDone,
        })),
    })),
  };
}

export async function updateWorkoutSet(
  setId: number,
  patch: { weight?: number; reps?: number; isDone?: boolean },
): Promise<void> {
  await db.update(sets).set(patch).where(eq(sets.id, setId));
}

export async function addWorkoutSet(
  workoutExerciseId: number,
): Promise<{ id: number; position: number }> {
  const existing = await db
    .select({ position: sets.position })
    .from(sets)
    .where(eq(sets.workoutExerciseId, workoutExerciseId))
    .orderBy(desc(sets.position))
    .limit(1);
  const nextPos = (existing.at(0)?.position ?? -1) + 1;

  const [created] = await db
    .insert(sets)
    .values({
      workoutExerciseId,
      position: nextPos,
      weight: 0,
      reps: 0,
      isDone: false,
    })
    .returning({ id: sets.id });

  return { id: created.id, position: nextPos };
}

export async function removeWorkoutSet(setId: number): Promise<void> {
  await db.delete(sets).where(eq(sets.id, setId));
}

export async function finishWorkout(id: number): Promise<void> {
  const finishedAt = new Date();
  const [workout] = await db.select().from(workouts).where(eq(workouts.id, id)).limit(1);
  if (!workout) return;

  const durationSec = Math.round((finishedAt.getTime() - workout.startedAt.getTime()) / 1000);

  const doneSets = await db
    .select({ weight: sets.weight, reps: sets.reps })
    .from(sets)
    .innerJoin(workoutExercises, eq(workoutExercises.id, sets.workoutExerciseId))
    .where(and(eq(workoutExercises.workoutId, id), eq(sets.isDone, true)));

  const totalVolume = doneSets.reduce((sum, s) => sum + s.weight * s.reps, 0);

  await db
    .update(workouts)
    .set({ finishedAt, durationSec, totalVolume })
    .where(eq(workouts.id, id));
}
