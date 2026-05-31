import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { palette } from '@/constants/theme';
import { useWorkout } from '@/hooks/use-workout';
import { formatDateTime, formatDuration, formatVolume } from '@/lib/format';
import { deleteWorkout } from '@/lib/workouts';

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutId = Number(id);
  const { detail, loading } = useWorkout(workoutId);

  const handleDelete = () => {
    if (!detail) return;
    Alert.alert('Usunąć trening?', detail.name, [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          await deleteWorkout(workoutId);
          router.back();
        },
      },
    ]);
  };

  if (!loading && !detail) {
    return (
      <>
        <Stack.Screen options={{ title: 'Nie znaleziono' }} />
        <EmptyState title="Trening nie istnieje" />
      </>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 40 }}>
      <Stack.Screen options={{ title: detail?.name ?? 'Trening' }} />

      {detail && (
        <>
          <View className="mx-4 my-3 rounded-lg bg-card p-4">
            <Text className="text-sm text-muted">{formatDateTime(detail.startedAt)}</Text>
            <View className="mt-3 flex-row">
              <View className="flex-1">
                <Text className="text-xs text-muted">Czas</Text>
                <Text className="text-base font-semibold text-foreground">
                  {formatDuration(detail.durationSec)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted">Objętość</Text>
                <Text className="text-base font-semibold text-foreground">
                  {formatVolume(detail.totalVolume)}
                </Text>
              </View>
            </View>
          </View>

          {detail.exercises.map((exercise) => (
            <View key={exercise.workoutExerciseId} className="mx-4 my-2 rounded-lg bg-card p-3">
              <Text className="text-base font-semibold text-foreground">{exercise.exerciseName}</Text>
              <View className="mt-2">
                {exercise.sets.map((set, idx) => (
                  <View key={set.id} className="flex-row items-center py-1">
                    <Text className="w-8 text-center text-muted">{idx + 1}.</Text>
                    <Text className="flex-1 text-foreground">
                      {set.weight} kg × {set.reps}
                    </Text>
                    {set.isDone && (
                      <Ionicons name="checkmark" size={18} color={palette.primary} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          <PrimaryButton title="Usuń trening" onPress={handleDelete} variant="danger" />
        </>
      )}
    </ScrollView>
  );
}

