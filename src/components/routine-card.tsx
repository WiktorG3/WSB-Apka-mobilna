import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import type { RoutineSummary } from '@/lib/routines';

type Props = {
  routine: RoutineSummary;
  onPress?: () => void;
  onStart?: () => void;
};

export function RoutineCard({ routine, onPress, onStart }: Props) {
  return (
    <View className="mx-4 my-2 flex-row items-center rounded-lg bg-card">
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        className="flex-1 p-4 active:opacity-80">
        <Text className="text-base font-semibold text-foreground">{routine.name}</Text>
        <Text className="mt-1 text-sm text-muted">Ćwiczenia: {routine.exerciseCount}</Text>
      </Pressable>
      {onStart && (
        <Pressable
          onPress={onStart}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-primary active:opacity-80">
          <Ionicons name="play" size={20} color={palette.foreground} />
        </Pressable>
      )}
    </View>
  );
}
