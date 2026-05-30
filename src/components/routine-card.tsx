import { Pressable, Text } from 'react-native';

import type { RoutineSummary } from '@/lib/routines';

type Props = {
  routine: RoutineSummary;
  onPress?: () => void;
};

export function RoutineCard({ routine, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="mx-4 my-2 rounded-lg bg-card p-4 active:opacity-80">
      <Text className="text-base font-semibold text-foreground">{routine.name}</Text>
      <Text className="mt-1 text-sm text-muted">Ćwiczenia: {routine.exerciseCount}</Text>
    </Pressable>
  );
}
