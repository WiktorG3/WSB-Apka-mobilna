import { and, asc, count, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { routineExercises, routineSets, routines } from '@/db/schema';

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

async function insertRoutineChildren(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  routineId: number,
  exercises: RoutineExerciseInput[],
): Promise<void> {
  for (const [position, exercise] of exercises.entries()) {
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
