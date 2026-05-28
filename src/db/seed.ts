import { exercisesSeed } from '@/data/exercises-seed';
import { db } from '@/db/client';
import { exercises } from '@/db/schema';

export async function seedExercises(): Promise<void> {
  const existing = await db.select({ name: exercises.name }).from(exercises);
  const existingNames = new Set(existing.map((row) => row.name));

  const missing = exercisesSeed.filter((exercise) => !existingNames.has(exercise.name));
  if (missing.length === 0) {
    console.log('[exercises-seed] Wszystkie ćwiczenia w bazie');
    return;
  }

  await db.insert(exercises).values(
    missing.map((exercise) => ({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
    })),
  );

  console.log(`[exercises-seed] Dodano ${missing.length} ćwiczeń`);
}
