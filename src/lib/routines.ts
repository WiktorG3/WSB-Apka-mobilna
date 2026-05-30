import { asc, count, eq, inArray } from 'drizzle-orm';

import { db } from '@/db/client';
import { exercises, routineExercises, routineSets, routines } from '@/db/schema';

export type RoutineSummary = {
  id: number;
  name: string;
  createdAt: Date;
  exerciseCount: number;
};

export type PlannedSetInput = {
  targetWeight: number | null;
  targetReps: number | null;
};

export type RoutineExerciseInput = {
  exerciseId: number;
  restSec: number | null;
  sets: PlannedSetInput[];
};

export type RoutineInput = {
  name: string;
  exercises: RoutineExerciseInput[];
};

export type RoutineDetail = {
  id: number;
  name: string;
  exercises: {
    routineExerciseId: number;
    exerciseId: number;
    exerciseName: string;
    restSec: number | null;
    sets: { id: number; targetWeight: number | null; targetReps: number | null }[];
  }[];
};

export async function getRoutines(): Promise<RoutineSummary[]> {
  return db
    .select({
      id: routines.id,
      name: routines.name,
      createdAt: routines.createdAt,
      exerciseCount: count(routineExercises.id),
    })
    .from(routines)
    .leftJoin(routineExercises, eq(routineExercises.routineId, routines.id))
    .groupBy(routines.id)
    .orderBy(asc(routines.createdAt));
}

export async function createRoutine(input: RoutineInput): Promise<number> {
  return db.transaction(async (tx) => {
    const [created] = await tx
      .insert(routines)
      .values({ name: input.name })
      .returning({ id: routines.id });
    await insertRoutineChildren(tx, created.id, input.exercises);
    return created.id;
  });
}

export async function getRoutineDetail(id: number): Promise<RoutineDetail | null> {
  const [routine] = await db.select().from(routines).where(eq(routines.id, id)).limit(1);
  if (!routine) return null;

  const re = await db
    .select({
      routineExerciseId: routineExercises.id,
      exerciseId: routineExercises.exerciseId,
      exerciseName: exercises.name,
      restSec: routineExercises.restSec,
    })
    .from(routineExercises)
    .innerJoin(exercises, eq(exercises.id, routineExercises.exerciseId))
    .where(eq(routineExercises.routineId, id))
    .orderBy(asc(routineExercises.position));

  const reIds = re.map((r) => r.routineExerciseId);
  const sets =
    reIds.length === 0
      ? []
      : await db
          .select()
          .from(routineSets)
          .where(inArray(routineSets.routineExerciseId, reIds))
          .orderBy(asc(routineSets.position));

  return {
    id: routine.id,
    name: routine.name,
    exercises: re.map((r) => ({
      routineExerciseId: r.routineExerciseId,
      exerciseId: r.exerciseId,
      exerciseName: r.exerciseName,
      restSec: r.restSec,
      sets: sets
        .filter((s) => s.routineExerciseId === r.routineExerciseId)
        .map((s) => ({
          id: s.id,
          targetWeight: s.targetWeight,
          targetReps: s.targetReps,
        })),
    })),
  };
}

export async function updateRoutine(id: number, input: RoutineInput): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.update(routines).set({ name: input.name }).where(eq(routines.id, id));
    await tx.delete(routineExercises).where(eq(routineExercises.routineId, id));
    await insertRoutineChildren(tx, id, input.exercises);
  });
}

export async function deleteRoutine(id: number): Promise<void> {
  await db.delete(routines).where(eq(routines.id, id));
}

async function insertRoutineChildren(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  routineId: number,
  list: RoutineExerciseInput[],
): Promise<void> {
  for (const [position, exercise] of list.entries()) {
    const [inserted] = await tx
      .insert(routineExercises)
      .values({
        routineId,
        exerciseId: exercise.exerciseId,
        position,
        restSec: exercise.restSec,
      })
      .returning({ id: routineExercises.id });
    if (exercise.sets.length === 0) continue;
    await tx.insert(routineSets).values(
      exercise.sets.map((set, setPosition) => ({
        routineExerciseId: inserted.id,
        position: setPosition,
        targetWeight: set.targetWeight,
        targetReps: set.targetReps,
      })),
    );
  }
}
