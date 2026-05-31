import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { WorkoutHistoryCard } from '@/components/workout-history-card';
import { palette } from '@/constants/theme';
import { useFinishedWorkouts } from '@/hooks/use-workout';

export default function HistoryScreen() {
  const router = useRouter();
  const { workouts, loading } = useFinishedWorkouts();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <Text className="px-4 pb-1 pt-2 text-2xl font-bold text-foreground">Historia</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <WorkoutHistoryCard
            workout={item}
            onPress={() => router.push({ pathname: '/history/[id]', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              icon={<Feather name="calendar" size={56} color={palette.muted} />}
              title="Brak treningów w historii"
              hint="Zakończony trening pojawi się tutaj z datą, czasem i objętością"
            />
          )
        }
      />
    </SafeAreaView>
  );
}
