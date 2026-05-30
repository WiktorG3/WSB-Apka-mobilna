import { Text, View } from 'react-native';

import { muscleGroupLabels } from '@/constants/labels';
import type { Exercise } from '@/db/schema';

type Props = {
  exercise: Exercise;
};

export function ExerciseRow({ exercise }: Props) {
  return (
    <View className="border-b border-border px-4 py-3">
      <Text className="text-base text-foreground">{exercise.name}</Text>
      <Text className="text-sm text-muted">{muscleGroupLabels[exercise.muscleGroup]}</Text>
    </View>
  );
}
