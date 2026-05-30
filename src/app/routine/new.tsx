import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { TextField } from '@/components/text-field';
import { createRoutine } from '@/lib/routines';

export default function NewRoutineScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = name.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await createRoutine({ name: name.trim(), exercises: [] });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
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

      <TextField
        label="Nazwa rutyny"
        value={name}
        onChangeText={setName}
        placeholder="np. Trening A - klatka i tricepsy"
      />

      <PrimaryButton title="Zapisz" onPress={handleSave} disabled={!canSave} />
    </ScrollView>
  );
}
