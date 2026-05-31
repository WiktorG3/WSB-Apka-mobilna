import { useHeaderHeight } from '@react-navigation/elements';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { RoutineFormBody } from '@/components/routine-form-body';
import { useRoutineDetail } from '@/hooks/use-routines';
import { deleteRoutine, updateRoutine } from '@/lib/routines';
import { buildRoutineInput, useRoutineEditor } from '@/store/routine-editor';

export default function EditRoutineScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = Number(id);
  const { detail, loading } = useRoutineDetail(routineId);

  const name = useRoutineEditor((s) => s.name);
  const exercises = useRoutineEditor((s) => s.exercises);
  const init = useRoutineEditor((s) => s.init);
  const reset = useRoutineEditor((s) => s.reset);

  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => () => reset(), [reset]);

  useEffect(() => {
    if (!detail || initialized) return;
    init({
      name: detail.name,
      exercises: detail.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.exerciseName,
        restSec: ex.restSec === null ? '' : String(ex.restSec),
        sets: ex.sets.map((s) => ({
          targetWeight: s.targetWeight === null ? '' : String(s.targetWeight),
          targetReps: s.targetReps === null ? '' : String(s.targetReps),
        })),
      })),
    });
    setInitialized(true);
  }, [detail, initialized, init]);

  const canSave = name.trim().length > 0 && !saving && initialized;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await updateRoutine(routineId, buildRoutineInput(name, exercises));
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!detail) return;
    Alert.alert('Usunąć rutynę?', detail.name, [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          await deleteRoutine(routineId);
          router.back();
        },
      },
    ]);
  };

  if (!loading && !detail) {
    return (
      <>
        <Stack.Screen options={{ title: 'Nie znaleziono' }} />
        <EmptyState title="Nie znaleziono rutyny" />
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
        <Stack.Screen
          options={{
            title: detail?.name ?? 'Edycja rutyny',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} className="px-3">
                <Text className="text-base text-primary">Anuluj</Text>
              </Pressable>
            ),
          }}
        />

        {initialized && (
          <>
            <RoutineFormBody onAddExercise={() => router.push('/exercise/picker')} />
            <PrimaryButton title="Zapisz" onPress={handleSave} disabled={!canSave} />
            <PrimaryButton title="Usuń rutynę" onPress={handleDelete} variant="danger" />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
