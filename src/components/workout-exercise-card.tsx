import { Pressable, Text, View } from 'react-native';

import { WorkoutSetRow } from '@/components/workout-set-row';

export type SessionSet = {
  id: number;
  weight: string;
  reps: string;
  isDone: boolean;
};

type Props = {
  name: string;
  sets: SessionSet[];
  onChangeWeight: (setId: number, text: string) => void;
  onChangeReps: (setId: number, text: string) => void;
  onCommitWeight: (setId: number) => void;
  onCommitReps: (setId: number) => void;
  onToggleDone: (setId: number) => void;
  onRemove: (setId: number) => void;
  onAddSet: () => void;
};

export function WorkoutExerciseCard({
  name,
  sets,
  onChangeWeight,
  onChangeReps,
  onCommitWeight,
  onCommitReps,
  onToggleDone,
  onRemove,
  onAddSet,
}: Props) {
  return (
    <View className="mx-4 my-2 rounded-lg bg-card p-3">
      <Text className="text-base font-semibold text-foreground">{name}</Text>

      <View className="mt-3 flex-row pb-1">
        <Text className="w-8 text-center text-xs text-muted">#</Text>
        <Text className="mx-1 flex-1 text-center text-xs text-muted">kg</Text>
        <Text className="mx-1 flex-1 text-center text-xs text-muted">powt.</Text>
        <View className="w-8" />
        <View className="w-7" />
      </View>

      {sets.map((set, idx) => (
        <WorkoutSetRow
          key={set.id}
          position={idx + 1}
          weight={set.weight}
          reps={set.reps}
          isDone={set.isDone}
          onChangeWeight={(t) => onChangeWeight(set.id, t)}
          onChangeReps={(t) => onChangeReps(set.id, t)}
          onCommitWeight={() => onCommitWeight(set.id)}
          onCommitReps={() => onCommitReps(set.id)}
          onToggleDone={() => onToggleDone(set.id)}
          onRemove={() => onRemove(set.id)}
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
