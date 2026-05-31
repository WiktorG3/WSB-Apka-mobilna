import { Alert, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { StatCard } from '@/components/stat-card';
import { useOverallStats } from '@/hooks/use-stats';
import { formatDuration } from '@/lib/format';
import { resetUserData } from '@/lib/reset';
import { useActiveWorkout } from '@/store/active-workout';
import { useRestTimer } from '@/store/rest-timer';

export default function ProfileScreen() {
  const { stats, loading, refetch } = useOverallStats();

  const handleReset = () => {
    Alert.alert(
      'Zresetować postęp?',
      'Wszystkie rutyny, treningi i własne ćwiczenia zostaną usunięte. Tej operacji nie da się cofnąć.',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Zresetuj',
          style: 'destructive',
          onPress: async () => {
            await resetUserData();
            useActiveWorkout.getState().clear();
            useRestTimer.getState().stop();
            refetch();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <Text className="px-4 pb-1 pt-2 text-2xl font-bold text-foreground">Profil</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="px-4 pb-2 pt-2 text-sm text-muted">Statystyki</Text>
        {loading ? null : !stats || stats.workoutCount === 0 ? (
          <EmptyState message="Zrób pierwszy trening, żeby zobaczyć statystyki" />
        ) : (
          <>
            <StatCard label="Treningi" value={String(stats.workoutCount)} />
            <StatCard label="Łączna objętość" value={`${Math.round(stats.totalVolume)} kg`} />
            <StatCard label="Łączny czas" value={formatDuration(stats.totalTimeSec)} />
          </>
        )}
        <PrimaryButton title="Zresetuj postęp" onPress={handleReset} variant="danger" />
      </ScrollView>
    </SafeAreaView>
  );
}

