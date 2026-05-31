import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { equipmentLabels, muscleGroupLabels } from '@/constants/labels';
import { palette } from '@/constants/theme';
import { useExercise } from '@/hooks/use-exercises';
import { useExercisePRs } from '@/hooks/use-stats';
import { deleteCustomExercise } from '@/lib/exercises';
import { formatDate } from '@/lib/format';
import type { ExercisePRs } from '@/lib/stats';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const { exercise, loading } = useExercise(numericId);
  const { prs, loading: prsLoading } = useExercisePRs(numericId);
  const router = useRouter();

  const handleDelete = () => {
    if (!exercise) return;
    Alert.alert('Usunąć ćwiczenie?', exercise.name, [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCustomExercise(numericId);
            router.back();
          } catch {
            Alert.alert(
              'Nie można usunąć',
              'To ćwiczenie jest używane w rutynie lub w historii treningów. Najpierw usuń je z planów albo z historii.',
            );
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: exercise?.name ?? 'Ładowanie...' }} />
      {loading ? null : !exercise ? (
        <EmptyState title="Nie znaleziono ćwiczenia" />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
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
          {!prsLoading &&
            (prs ? (
              <PRsCard prs={prs} />
            ) : (
              <View className="my-4">
                <EmptyState
                  icon={<Feather name="award" size={56} color={palette.muted} />}
                  title="Brak rekordów"
                  hint="Tu pojawią się Twoje rekordy gdy wykonasz to ćwiczenie"
                />
              </View>
            ))}
          {exercise.isCustom && (
            <PrimaryButton title="Usuń ćwiczenie" onPress={handleDelete} variant="danger" />
          )}
        </ScrollView>
      )}
    </View>
  );
}

function PRsCard({ prs }: { prs: ExercisePRs }) {
  return (
    <View className="mx-4 mb-4 rounded-lg bg-card p-4">
      <Text className="mb-3 text-sm font-semibold text-foreground">Rekordy</Text>
      <PRRow label="Najcięższy ciężar" value={`${prs.maxWeight} kg`} />
      <PRRow label="Maks. powtórzeń" value={String(prs.maxReps)} />
      <PRRow label="Najlepsza objętość serii" value={`${Math.round(prs.maxVolume)} kg`} />
      <PRRow label="Ostatnio" value={formatDate(prs.lastPerformedAt)} />
    </View>
  );
}

function PRRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className="text-muted">{label}</Text>
      <Text className="font-semibold text-foreground">{value}</Text>
    </View>
  );
}

