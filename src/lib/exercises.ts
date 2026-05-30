import { asc } from 'drizzle-orm';

import { db } from '@/db/client';
import { exercises, type Exercise } from '@/db/schema';

export async function getExercises(): Promise<Exercise[]> {
  return db.select().from(exercises).orderBy(asc(exercises.name));
}
