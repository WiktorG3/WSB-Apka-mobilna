import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRestTimer } from '@/store/rest-timer';

export function RestTimerBanner() {
  const endsAt = useRestTimer((s) => s.endsAt);
  const exerciseName = useRestTimer((s) => s.exerciseName);
  const stop = useRestTimer((s) => s.stop);
  const insets = useSafeAreaInsets();
  const [, setTick] = useState(0);

  useEffect(() => {
    if (endsAt === null) return;

    if (Date.now() >= endsAt) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      stop();
      return;
    }

    const id = setInterval(() => {
      if (Date.now() >= endsAt) {
        clearInterval(id);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        stop();
        return;
      }
      setTick((t) => t + 1);
    }, 500);

    return () => clearInterval(id);
  }, [endsAt, stop]);

  if (endsAt === null) return null;

  const remainingMs = Math.max(0, endsAt - Date.now());
  const totalSec = Math.ceil(remainingMs / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const formatted = `${min}:${String(sec).padStart(2, '0')}`;

  return (
    <View
      style={{ marginBottom: insets.bottom + 8 }}
      className="mx-4 flex-row items-center rounded-lg border border-primary bg-card px-4 py-3">
      <View className="flex-1">
        <Text className="text-xs text-muted">Odpoczynek: {exerciseName}</Text>
        <Text className="text-2xl font-bold text-foreground">{formatted}</Text>
      </View>
      <Pressable
        onPress={stop}
        className="rounded-lg bg-background px-4 py-2 active:opacity-80">
        <Text className="text-sm font-semibold text-foreground">Pomiń</Text>
      </Pressable>
    </View>
  );
}
