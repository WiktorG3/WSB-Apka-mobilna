import { Pressable, Text } from 'react-native';

import type { WorkoutHistoryItem } from '@/lib/workouts';

const MONTHS_PL = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

type Props = {
  workout: WorkoutHistoryItem;
  onPress?: () => void;
};

export function WorkoutHistoryCard({ workout, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="mx-4 my-2 rounded-lg bg-card p-4 active:opacity-80">
      <Text className="text-base font-semibold text-foreground">{workout.name}</Text>
      <Text className="mt-1 text-sm text-muted">{formatDateTime(workout.finishedAt)}</Text>
      <Text className="mt-2 text-sm text-foreground">
        {formatDuration(workout.durationSec)} · {formatVolume(workout.totalVolume)}
      </Text>
    </Pressable>
  );
}

function formatDateTime(d: Date): string {
  const day = d.getDate();
  const month = MONTHS_PL[d.getMonth()];
  const year = d.getFullYear();
  const hour = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hour}:${min}`;
}

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return '0 min';
  const totalMin = Math.floor(seconds / 60);
  if (totalMin < 60) return `${totalMin} min`;
  const hours = Math.floor(totalMin / 60);
  const remMin = totalMin % 60;
  return `${hours} h ${remMin} min`;
}

function formatVolume(volume: number | null): string {
  return `${Math.round(volume ?? 0)} kg`;
}
