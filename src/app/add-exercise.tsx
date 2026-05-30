import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { TextField } from '@/components/text-field';
import { equipmentLabels, muscleGroupLabels } from '@/constants/labels';
import { equipmentTypes, muscleGroups, type Equipment, type MuscleGroup } from '@/db/schema';
import { createCustomExercise } from '@/lib/exercises';

export default function AddExerciseScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('chest');
  const [equipment, setEquipment] = useState<Equipment>('barbell');
  const [saving, setSaving] = useState(false);

  const canSave = name.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await createCustomExercise({ name: name.trim(), muscleGroup, equipment });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="px-3">
              <Text className="text-base text-primary">Anuluj</Text>
            </Pressable>
          ),
        }}
      />

      <TextField
        label="Nazwa"
        value={name}
        onChangeText={setName}
        placeholder="np. Wyciskanie sztangi"
      />

      <Text className="mx-4 mb-1 mt-4 text-sm text-muted">Grupa mięśniowa</Text>
      <View className="mx-4 flex-row flex-wrap gap-2">
        {muscleGroups.map((group) => {
          const selected = muscleGroup === group;
          return (
            <Pressable
              key={group}
              onPress={() => setMuscleGroup(group)}
              className={`rounded-full border px-3 py-1 ${
                selected ? 'border-primary bg-primary' : 'border-border bg-card'
              }`}>
              <Text className={`text-sm ${selected ? 'text-foreground' : 'text-muted'}`}>
                {muscleGroupLabels[group]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="mx-4 mb-1 mt-4 text-sm text-muted">Sprzęt</Text>
      <View className="mx-4 flex-row flex-wrap gap-2">
        {equipmentTypes.map((eq) => {
          const selected = equipment === eq;
          return (
            <Pressable
              key={eq}
              onPress={() => setEquipment(eq)}
              className={`rounded-full border px-3 py-1 ${
                selected ? 'border-primary bg-primary' : 'border-border bg-card'
              }`}>
              <Text className={`text-sm ${selected ? 'text-foreground' : 'text-muted'}`}>
                {equipmentLabels[eq]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-6">
        <PrimaryButton title="Zapisz" onPress={handleSave} disabled={!canSave} />
      </View>
    </ScrollView>
  );
}
