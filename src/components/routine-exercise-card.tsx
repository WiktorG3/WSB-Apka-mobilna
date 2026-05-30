import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';

import { PlannedSetRow } from '@/components/planned-set-row';
import { palette } from '@/constants/theme';
import type { DraftExercise } from '@/store/routine-editor';

type Props = {
  exercise: DraftExercise;
  onRemove: () => void;
  onChangeRestSec: (text: string) => void;
  onAddSet: () => void;
  onChangeSetWeight: (setIndex: number, text: string) => void;
  onChangeSetReps: (setIndex: number, text: string) => void;
  onRemoveSet: (setIndex: number) => void;
};

export function RoutineExerciseCard({
  exercise,
  onRemove,
  onChangeRestSec,
  onAddSet,
  onChangeSetWeight,
  onChangeSetReps,
  onRemoveSet,
}: Props) {
  return (
    <View className="mx-4 my-2 rounded-lg bg-card p-3">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-base font-semibold text-foreground">{exercise.name}</Text>
        <Pressable onPress={onRemove} className="px-2">
          <Ionicons name="trash" size={20} color={palette.muted} />
        </Pressable>
      </View>

      <View className="mt-2 flex-row items-center">
        <Text className="text-sm text-muted">Przerwa (s):</Text>
        <TextInput
          value={exercise.restSec}
          onChangeText={onChangeRestSec}
          keyboardType="number-pad"
          placeholder="60"
          placeholderTextColor={palette.muted}
          className="ml-2 w-20 rounded bg-background px-2 py-1 text-center text-foreground"
        />
      </View>

      <View className="mt-3 flex-row pb-1">
        <Text className="w-8 text-center text-xs text-muted">#</Text>
        <Text className="mx-1 flex-1 text-center text-xs text-muted">kg</Text>
        <Text className="mx-1 flex-1 text-center text-xs text-muted">powt.</Text>
        <View className="w-8" />
      </View>

      {exercise.sets.map((set, idx) => (
        <PlannedSetRow
          key={idx}
          position={idx + 1}
          weight={set.targetWeight}
          reps={set.targetReps}
          onChangeWeight={(t) => onChangeSetWeight(idx, t)}
          onChangeReps={(t) => onChangeSetReps(idx, t)}
          onRemove={() => onRemoveSet(idx)}
        />
      ))}

      <Pressable
        onPress={onAddSet}
        className="mt-2 items-center rounded bg-background py-2 active:opacity-80">
        <Text className="text-sm text-primary">+ Dodaj serię</Text>
      </Pressable>
    </View>
  );
}
