import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ExerciseRow } from '@/components/exercise-row';
import { PrimaryButton } from '@/components/primary-button';
import { SearchBar } from '@/components/search-bar';
import { palette } from '@/constants/theme';
import { useExercises } from '@/hooks/use-exercises';

export default function ExercisesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { exercises, loading } = useExercises(query);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <Text className="px-4 pb-1 pt-2 text-2xl font-bold text-foreground">Ćwiczenia</Text>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Szukaj ćwiczenia" />
      <PrimaryButton title="Dodaj własne ćwiczenie" onPress={() => router.push('/add-exercise')} />
      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <ExerciseRow
            exercise={item}
            onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              icon={<Feather name="search" size={56} color={palette.muted} />}
              title="Brak ćwiczeń"
              hint="Spróbuj innego wyszukiwania lub dodaj własne ćwiczenie"
            />
          )
        }
      />
    </SafeAreaView>
  );
}
