import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';

import { palette } from '@/constants/theme';

type Props = {
  position: number;
  weight: string;
  reps: string;
  isDone: boolean;
  onChangeWeight: (text: string) => void;
  onChangeReps: (text: string) => void;
  onCommitWeight: () => void;
  onCommitReps: () => void;
  onToggleDone: () => void;
  onRemove: () => void;
};

export function WorkoutSetRow({
  position,
  weight,
  reps,
  isDone,
  onChangeWeight,
  onChangeReps,
  onCommitWeight,
  onCommitReps,
  onToggleDone,
  onRemove,
}: Props) {
  return (
    <View className={`flex-row items-center py-1 ${isDone ? 'opacity-60' : ''}`}>
      <Text className="w-8 text-center text-foreground">{position}</Text>
      <TextInput
        value={weight}
        onChangeText={onChangeWeight}
        onBlur={onCommitWeight}
        keyboardType="decimal-pad"
        placeholder="kg"
        placeholderTextColor={palette.muted}
        className="mx-1 flex-1 rounded bg-background px-2 py-1 text-center text-foreground"
      />
      <TextInput
        value={reps}
        onChangeText={onChangeReps}
        onBlur={onCommitReps}
        keyboardType="number-pad"
        placeholder="powt."
        placeholderTextColor={palette.muted}
        className="mx-1 flex-1 rounded bg-background px-2 py-1 text-center text-foreground"
      />
      <Pressable onPress={onToggleDone} className="px-2">
        <Ionicons
          name={isDone ? 'checkbox' : 'square-outline'}
          size={22}
          color={isDone ? palette.primary : palette.muted}
        />
      </Pressable>
      <Pressable onPress={onRemove} className="px-1">
        <Ionicons name="close" size={20} color={palette.muted} />
      </Pressable>
    </View>
  );
}
