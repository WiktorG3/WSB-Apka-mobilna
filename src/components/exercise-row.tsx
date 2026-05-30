import { Pressable, Text } from 'react-native';

import { muscleGroupLabels } from '@/constants/labels';
import type { Exercise } from '@/db/schema';

type Props = {
  exercise: Exercise;
  onPress?: () => void;
};

export function ExerciseRow({ exercise, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="border-b border-border px-4 py-3 active:bg-card">
      <Text className="text-base text-foreground">{exercise.name}</Text>
      <Text className="text-sm text-muted">{muscleGroupLabels[exercise.muscleGroup]}</Text>
    </Pressable>
  );
}
