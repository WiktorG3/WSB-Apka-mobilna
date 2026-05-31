import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { exercises, routines, workouts } from '@/db/schema';

export async function resetUserData(): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(workouts);
    await tx.delete(routines);
    await tx.delete(exercises).where(eq(exercises.isCustom, true));
  });
}
