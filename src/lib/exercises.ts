import { and, asc, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { exercises, type Equipment, type Exercise, type MuscleGroup } from '@/db/schema';

export async function getExercises(): Promise<Exercise[]> {
  return db.select().from(exercises).orderBy(asc(exercises.name));
}

export async function getExerciseById(id: number): Promise<Exercise | undefined> {
  const result = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
  return result.at(0);
}

type CreateCustomExerciseInput = {
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
};

export async function createCustomExercise(input: CreateCustomExerciseInput): Promise<Exercise> {
  const [created] = await db
    .insert(exercises)
    .values({ ...input, isCustom: true })
    .returning();
  return created;
}

export async function deleteCustomExercise(id: number): Promise<void> {
  await db.delete(exercises).where(and(eq(exercises.id, id), eq(exercises.isCustom, true)));
}
