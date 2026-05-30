import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { muscleGroupLabels } from '@/constants/labels';
import { palette } from '@/constants/theme';
import type { Exercise } from '@/db/schema';

type Props = {
  exercise: Exercise;
  selected: boolean;
  onToggle: () => void;
};

export function ExercisePickerRow({ exercise, selected, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center border-b border-border px-4 py-3 active:bg-card">
      <Ionicons
        name={selected ? 'checkbox' : 'square-outline'}
        size={22}
        color={selected ? palette.primary : palette.muted}
      />
      <View className="ml-3">
        <Text className="text-base text-foreground">{exercise.name}</Text>
        <Text className="text-sm text-muted">{muscleGroupLabels[exercise.muscleGroup]}</Text>
      </View>
    </Pressable>
  );
}
