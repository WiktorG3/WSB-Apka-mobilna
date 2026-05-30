import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { equipmentLabels, muscleGroupLabels } from '@/constants/labels';
import { useExercise } from '@/hooks/use-exercises';
import { deleteCustomExercise } from '@/lib/exercises';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const { exercise, loading } = useExercise(numericId);
  const router = useRouter();

  const handleDelete = () => {
    if (!exercise) return;
    Alert.alert('Usunąć ćwiczenie?', exercise.name, [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          await deleteCustomExercise(numericId);
          router.back();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: exercise?.name ?? 'Ładowanie...' }} />
      {loading ? null : !exercise ? (
        <EmptyState message="Nie znaleziono ćwiczenia" />
      ) : (
        <ScrollView>
          <View className="mx-4 my-4 rounded-lg bg-card p-4">
            <Text className="mb-1 text-sm text-muted">Grupa mięśniowa</Text>
            <Text className="mb-4 text-base text-foreground">
              {muscleGroupLabels[exercise.muscleGroup]}
            </Text>
            <Text className="mb-1 text-sm text-muted">Sprzęt</Text>
            <Text className="text-base text-foreground">
              {equipmentLabels[exercise.equipment]}
            </Text>
          </View>
          {exercise.isCustom && (
            <PrimaryButton title="Usuń ćwiczenie" onPress={handleDelete} variant="danger" />
          )}
        </ScrollView>
      )}
    </View>
  );
}
