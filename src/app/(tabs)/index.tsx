import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActiveWorkoutBanner } from '@/components/active-workout-banner';
import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { RoutineCard } from '@/components/routine-card';
import { palette } from '@/constants/theme';
import { useRoutines } from '@/hooks/use-routines';
import { startWorkoutFromRoutine } from '@/lib/workouts';
import { useActiveWorkout } from '@/store/active-workout';

export default function TrainingScreen() {
  const router = useRouter();
  const { routines, loading } = useRoutines();
  const active = useActiveWorkout((s) => s.active);
  const setActive = useActiveWorkout((s) => s.setActive);

  const handleStart = async (routineId: number, routineName: string) => {
    if (active !== null) {
      Alert.alert(
        'Masz trening w trakcie',
        'Najpierw wznów lub zakończ aktywny trening.',
        [{ text: 'OK' }],
      );
      return;
    }
    try {
      const newId = await startWorkoutFromRoutine(routineId);
      setActive({ id: newId, name: routineName, startedAt: Date.now() });
      router.push({ pathname: '/workout/[id]', params: { id: newId } });
    } catch {
      Alert.alert('Błąd', 'Nie udało się rozpocząć treningu.');
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <Text className="px-4 pb-1 pt-2 text-2xl font-bold text-foreground">Trening</Text>
      {active && <ActiveWorkoutBanner workoutId={active.id} name={active.name} />}
      <PrimaryButton title="Nowa rutyna" onPress={() => router.push('/routine/new')} />
      <FlatList
        data={routines}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <RoutineCard
            routine={item}
            onPress={() => router.push({ pathname: '/routine/[id]', params: { id: item.id } })}
            onStart={() => handleStart(item.id, item.name)}
          />
        )}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              icon={<Feather name="clipboard" size={56} color={palette.muted} />}
              title="Brak rutyn"
              hint="Kliknij 'Nowa rutyna' żeby dodać pierwszy plan treningowy"
            />
          )
        }
      />
    </SafeAreaView>
  );
}
