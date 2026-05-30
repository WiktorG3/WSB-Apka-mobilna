import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import 'react-native-reanimated';
import '../../global.css';

import { palette } from '@/constants/theme';
import { db } from '@/db/client';
import { seedExercises } from '@/db/seed';
import migrations from '../../drizzle/migrations';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!success) return;
    seedExercises().finally(() => setSeeded(true));
  }, [success]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-center text-danger">Nie udało się przygotować bazy: {error.message}</Text>
      </View>
    );
  }

  if (!success || !seeded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-exercise"
          options={{ presentation: 'modal', title: 'Dodaj ćwiczenie' }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
