import { useHeaderHeight } from '@react-navigation/elements';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { RoutineFormBody } from '@/components/routine-form-body';
import { createRoutine } from '@/lib/routines';
import { buildRoutineInput, useRoutineEditor } from '@/store/routine-editor';

export default function NewRoutineScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const name = useRoutineEditor((s) => s.name);
  const exercises = useRoutineEditor((s) => s.exercises);
  const reset = useRoutineEditor((s) => s.reset);
  const [saving, setSaving] = useState(false);

  useEffect(() => () => reset(), [reset]);

  const canSave = name.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await createRoutine(buildRoutineInput(name, exercises));
      router.back();
    } finally {
      setSaving(false);
    }
  };

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
            title: 'Nowa rutyna',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} className="px-3">
                <Text className="text-base text-primary">Anuluj</Text>
              </Pressable>
            ),
          }}
        />

        <RoutineFormBody onAddExercise={() => router.push('/exercise/picker')} />
        <PrimaryButton title="Zapisz" onPress={handleSave} disabled={!canSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
