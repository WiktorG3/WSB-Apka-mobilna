import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getRoutines, type RoutineSummary } from '@/lib/routines';

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
