import { FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { WorkoutHistoryCard } from '@/components/workout-history-card';
import { useFinishedWorkouts } from '@/hooks/use-workout';

export default function HistoryScreen() {
  const { workouts, loading } = useFinishedWorkouts();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <Text className="px-4 pb-1 pt-2 text-2xl font-bold text-foreground">Historia</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <WorkoutHistoryCard workout={item} />}
        ListEmptyComponent={
          loading ? null : <EmptyState message="Brak zakończonych treningów" />
        }
      />
    </SafeAreaView>
  );
}
