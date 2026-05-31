import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getExercisePRs,
  getOverallStats,
  type ExercisePRs,
  type OverallStats,
} from '@/lib/stats';

export function useOverallStats(): {
  stats: OverallStats | null;
  loading: boolean;
  refetch: () => void;
} {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    getOverallStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useFocusEffect(load);

  return { stats, loading, refetch: load };
}

export function useExercisePRs(id: number): { prs: ExercisePRs | null; loading: boolean } {
  const [prs, setPRs] = useState<ExercisePRs | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getExercisePRs(id)
        .then((data) => {
          setPRs(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [id]),
  );

  return { prs, loading };
}
