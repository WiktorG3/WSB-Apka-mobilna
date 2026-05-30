import { useRouter } from 'expo-router';
import { FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { RoutineCard } from '@/components/routine-card';
import { useRoutines } from '@/hooks/use-routines';

export default function TrainingScreen() {
  const router = useRouter();
  const { routines, loading } = useRoutines();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <Text className="px-4 pb-1 pt-2 text-2xl font-bold text-foreground">Trening</Text>
      <PrimaryButton title="Nowa rutyna" onPress={() => router.push('/routine/new')} />
      <FlatList
        data={routines}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <RoutineCard routine={item} />}
        ListEmptyComponent={loading ? null : <EmptyState message="Brak rutyn" />}
      />
    </SafeAreaView>
  );
}
