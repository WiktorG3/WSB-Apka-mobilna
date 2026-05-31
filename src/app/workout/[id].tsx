import { useHeaderHeight } from '@react-navigation/elements';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { RestTimerBanner } from '@/components/rest-timer-banner';
import { WorkoutExerciseCard, type SessionSet } from '@/components/workout-exercise-card';
import { useWorkout } from '@/hooks/use-workout';
import { parseFloatOrNull, parseIntOrNull } from '@/lib/parse';
import {
  addWorkoutSet,
  finishWorkout,
  removeWorkoutSet,
  updateWorkoutSet,
} from '@/lib/workouts';
import { useActiveWorkout } from '@/store/active-workout';
import { useRestTimer } from '@/store/rest-timer';

type ExerciseDraft = {
  workoutExerciseId: number;
  name: string;
  restSec: number | null;
  sets: SessionSet[];
};

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutId = Number(id);
  const { detail, loading } = useWorkout(workoutId);
  const clearActive = useActiveWorkout((s) => s.clear);
  const startTimer = useRestTimer((s) => s.start);

  const [draft, setDraft] = useState<ExerciseDraft[]>([]);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (!detail) return;
    setDraft(
      detail.exercises.map((ex) => ({
        workoutExerciseId: ex.workoutExerciseId,
        name: ex.exerciseName,
        restSec: ex.restSec,
        sets: ex.sets.map((s) => ({
          id: s.id,
          weight: s.weight === 0 ? '' : String(s.weight),
          reps: s.reps === 0 ? '' : String(s.reps),
          isDone: s.isDone,
        })),
      })),
    );
  }, [detail]);

  useEffect(() => () => useRestTimer.getState().stop(), []);

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
    await updateWorkoutSet(setId, { weight: parseFloatOrNull(set.weight) ?? 0 });
  };

  const commitReps = async (setId: number) => {
    const set = findSet(draft, setId);
    if (!set) return;
    await updateWorkoutSet(setId, { reps: parseIntOrNull(set.reps) ?? 0 });
  };

  const toggleDone = async (setId: number) => {
    const set = findSet(draft, setId);
    if (!set) return;
    const next = !set.isDone;
    patchSet(setId, { isDone: next });
    await updateWorkoutSet(setId, { isDone: next });

    if (next) {
      const exercise = draft.find((ex) => ex.sets.some((s) => s.id === setId));
      if (exercise?.restSec && exercise.restSec > 0) {
        startTimer(exercise.restSec, exercise.name);
      }
    }
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
            clearActive();
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
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}>
        <ScrollView
          className="flex-1"
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
        <RestTimerBanner />
      </KeyboardAvoidingView>
    </View>
  );
}

function findSet(draft: ExerciseDraft[], setId: number): SessionSet | undefined {
  for (const ex of draft) {
    const found = ex.sets.find((s) => s.id === setId);
    if (found) return found;
  }
  return undefined;
}

