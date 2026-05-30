import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';

import { palette } from '@/constants/theme';

type Props = {
  position: number;
  weight: string;
  reps: string;
  onChangeWeight: (text: string) => void;
  onChangeReps: (text: string) => void;
  onRemove: () => void;
};

export function PlannedSetRow({
  position,
  weight,
  reps,
  onChangeWeight,
  onChangeReps,
  onRemove,
}: Props) {
  return (
    <View className="flex-row items-center py-1">
      <Text className="w-8 text-center text-foreground">{position}</Text>
      <TextInput
        value={weight}
        onChangeText={onChangeWeight}
        keyboardType="decimal-pad"
        placeholder="kg"
        placeholderTextColor={palette.muted}
        className="mx-1 flex-1 rounded bg-background px-2 py-1 text-center text-foreground"
      />
      <TextInput
        value={reps}
        onChangeText={onChangeReps}
        keyboardType="number-pad"
        placeholder="powt."
        placeholderTextColor={palette.muted}
        className="mx-1 flex-1 rounded bg-background px-2 py-1 text-center text-foreground"
      />
      <Pressable onPress={onRemove} className="px-2">
        <Ionicons name="close" size={20} color={palette.muted} />
      </Pressable>
    </View>
  );
}
