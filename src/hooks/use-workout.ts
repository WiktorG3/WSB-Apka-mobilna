import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getWorkoutDetail, type WorkoutDetail } from '@/lib/workouts';

export function useWorkout(id: number): { detail: WorkoutDetail | null; loading: boolean } {
  const [detail, setDetail] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getWorkoutDetail(id)
        .then((data) => {
          setDetail(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [id]),
  );

  return { detail, loading };
}
