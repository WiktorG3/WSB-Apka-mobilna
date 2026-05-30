import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getFinishedWorkouts,
  getWorkoutDetail,
  type WorkoutDetail,
  type WorkoutHistoryItem,
} from '@/lib/workouts';

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

export function useFinishedWorkouts(): {
  workouts: WorkoutHistoryItem[];
  loading: boolean;
} {
  const [workouts, setWorkouts] = useState<WorkoutHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getFinishedWorkouts()
        .then((data) => {
          setWorkouts(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []),
  );

  return { workouts, loading };
}
