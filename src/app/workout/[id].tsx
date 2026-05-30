import { useHeaderHeight } from '@react-navigation/elements';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { WorkoutExerciseCard, type SessionSet } from '@/components/workout-exercise-card';
import { useWorkout } from '@/hooks/use-workout';
import {
  addWorkoutSet,
  finishWorkout,
  removeWorkoutSet,
  updateWorkoutSet,
} from '@/lib/workouts';
import { useActiveWorkout } from '@/store/active-workout';

type ExerciseDraft = {
  workoutExerciseId: number;
  name: string;
  sets: SessionSet[];
};

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutId = Number(id);
  const { detail, loading } = useWorkout(workoutId);
  const clearWorkoutId = useActiveWorkout((s) => s.clearWorkoutId);

  const [draft, setDraft] = useState<ExerciseDraft[]>([]);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (!detail) return;
    setDraft(
      detail.exercises.map((ex) => ({
        workoutExerciseId: ex.workoutExerciseId,
        name: ex.exerciseName,
        sets: ex.sets.map((s) => ({
          id: s.id,
          weight: s.weight === 0 ? '' : String(s.weight),
          reps: s.reps === 0 ? '' : String(s.reps),
          isDone: s.isDone,
        })),
      })),
    );
  }, [detail]);

  const patchSet = (setId: number, patch: Partial<SessionSet>) => {
    setDraft((prev) =>
      prev.map((ex) => ({
        ...ex,
        sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)),
      })),
    );
  };

  const commitWeight = async (setId: number) => {
    const set = findSet(draft, setId);
    if (!set) return;
    await updateWorkoutSet(setId, { weight: parseNumber(set.weight) });
  };

  const commitReps = async (setId: number) => {
    const set = findSet(draft, setId);
    if (!set) return;
    await updateWorkoutSet(setId, { reps: parseIntZero(set.reps) });
  };

  const toggleDone = async (setId: number) => {
    const set = findSet(draft, setId);
    if (!set) return;
    const next = !set.isDone;
    patchSet(setId, { isDone: next });
    await updateWorkoutSet(setId, { isDone: next });
  };

  const removeSet = async (setId: number) => {
    setDraft((prev) =>
      prev.map((ex) => ({ ...ex, sets: ex.sets.filter((s) => s.id !== setId) })),
    );
    await removeWorkoutSet(setId);
  };

  const addSet = async (workoutExerciseId: number) => {
    const result = await addWorkoutSet(workoutExerciseId);
    setDraft((prev) =>
      prev.map((ex) =>
        ex.workoutExerciseId === workoutExerciseId
          ? {
              ...ex,
              sets: [...ex.sets, { id: result.id, weight: '', reps: '', isDone: false }],
            }
          : ex,
      ),
    );
  };

  const handleFinish = () => {
    Alert.alert('Zakończyć trening?', 'Zapisany trafi do historii.', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Zakończ',
        onPress: async () => {
          if (finishing) return;
          setFinishing(true);
          try {
            await finishWorkout(workoutId);
            clearWorkoutId();
            router.back();
          } finally {
            setFinishing(false);
          }
        },
      },
    ]);
  };

  if (!loading && !detail) {
    return (
      <>
        <Stack.Screen options={{ title: 'Nie znaleziono' }} />
        <EmptyState message="Trening nie istnieje" />
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}>
      <ScrollView
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}>
        <Stack.Screen options={{ title: detail?.name ?? 'Trening' }} />

        {draft.map((exercise) => (
          <WorkoutExerciseCard
            key={exercise.workoutExerciseId}
            name={exercise.name}
            sets={exercise.sets}
            onChangeWeight={(setId, t) => patchSet(setId, { weight: t })}
            onChangeReps={(setId, t) => patchSet(setId, { reps: t })}
            onCommitWeight={commitWeight}
            onCommitReps={commitReps}
            onToggleDone={toggleDone}
            onRemove={removeSet}
            onAddSet={() => addSet(exercise.workoutExerciseId)}
          />
        ))}

        <PrimaryButton title="Zakończ trening" onPress={handleFinish} disabled={finishing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function findSet(draft: ExerciseDraft[], setId: number): SessionSet | undefined {
  for (const ex of draft) {
    const found = ex.sets.find((s) => s.id === setId);
    if (found) return found;
  }
  return undefined;
}

function parseNumber(s: string): number {
  const normalized = s.replace(',', '.').trim();
  if (normalized === '') return 0;
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

function parseIntZero(s: string): number {
  const trimmed = s.trim();
  if (trimmed === '') return 0;
  const n = parseInt(trimmed, 10);
  return Number.isFinite(n) ? n : 0;
}
