import { and, eq, isNotNull } from 'drizzle-orm';

import { db } from '@/db/client';
import { sets, workoutExercises, workouts } from '@/db/schema';

export type OverallStats = {
  workoutCount: number;
  totalVolume: number;
  totalTimeSec: number;
};

export async function getOverallStats(): Promise<OverallStats> {
  const rows = await db
    .select({
      durationSec: workouts.durationSec,
      totalVolume: workouts.totalVolume,
    })
    .from(workouts)
    .where(isNotNull(workouts.finishedAt));

  return rows.reduce<OverallStats>(
    (acc, row) => ({
      workoutCount: acc.workoutCount + 1,
      totalVolume: acc.totalVolume + (row.totalVolume ?? 0),
      totalTimeSec: acc.totalTimeSec + (row.durationSec ?? 0),
    }),
    { workoutCount: 0, totalVolume: 0, totalTimeSec: 0 },
  );
}

export type ExercisePRs = {
  maxWeight: number;
  maxReps: number;
  maxVolume: number;
  lastPerformedAt: Date;
};

export async function getExercisePRs(exerciseId: number): Promise<ExercisePRs | null> {
  const rows = await db
    .select({
      weight: sets.weight,
      reps: sets.reps,
      finishedAt: workouts.finishedAt,
    })
    .from(sets)
    .innerJoin(workoutExercises, eq(workoutExercises.id, sets.workoutExerciseId))
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(
      and(
        eq(workoutExercises.exerciseId, exerciseId),
        eq(sets.isDone, true),
        isNotNull(workouts.finishedAt),
      ),
    );

  if (rows.length === 0) return null;

  let maxWeight = 0;
  let maxReps = 0;
  let maxVolume = 0;
  let lastPerformedAt = new Date(0);

  for (const r of rows) {
    if (r.weight > maxWeight) maxWeight = r.weight;
    if (r.reps > maxReps) maxReps = r.reps;
    const vol = r.weight * r.reps;
    if (vol > maxVolume) maxVolume = vol;
    if (r.finishedAt && r.finishedAt.getTime() > lastPerformedAt.getTime()) {
      lastPerformedAt = r.finishedAt;
    }
  }

  return { maxWeight, maxReps, maxVolume, lastPerformedAt };
}
