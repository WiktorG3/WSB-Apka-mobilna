import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { StatCard } from '@/components/stat-card';
import { useOverallStats } from '@/hooks/use-stats';
import { formatDuration } from '@/lib/format';

export default function ProfileScreen() {
  const { stats, loading } = useOverallStats();

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
      </ScrollView>
    </SafeAreaView>
  );
}

