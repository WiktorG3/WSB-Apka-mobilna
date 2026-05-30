import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getRoutineDetail, getRoutines, type RoutineDetail, type RoutineSummary } from '@/lib/routines';

export function useRoutines(): { routines: RoutineSummary[]; loading: boolean } {
  const [routines, setRoutines] = useState<RoutineSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getRoutines()
        .then((data) => {
          setRoutines(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []),
  );

  return { routines, loading };
}

export function useRoutineDetail(id: number): { detail: RoutineDetail | null; loading: boolean } {
  const [detail, setDetail] = useState<RoutineDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getRoutineDetail(id)
        .then((data) => {
          setDetail(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [id]),
  );

  return { detail, loading };
}
