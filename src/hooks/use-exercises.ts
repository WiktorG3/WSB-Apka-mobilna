import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Exercise } from '@/db/schema';
import { getExercises } from '@/lib/exercises';

export function useExercises(query: string): { exercises: Exercise[]; loading: boolean } {
  const [all, setAll] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getExercises().then((data) => {
        setAll(data);
        setLoading(false);
      });
    }, []),
  );

  const normalized = query.trim().toLowerCase();
  const exercises = normalized
    ? all.filter((exercise) => exercise.name.toLowerCase().includes(normalized))
    : all;

  return { exercises, loading };
}
