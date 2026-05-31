import { Pressable, Text } from 'react-native';

import { formatDateTime, formatDuration, formatVolume } from '@/lib/format';
import type { WorkoutHistoryItem } from '@/lib/workouts';

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
