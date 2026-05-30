import { useState } from 'react';
import { FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ExerciseRow } from '@/components/exercise-row';
import { SearchBar } from '@/components/search-bar';
import { useExercises } from '@/hooks/use-exercises';

export default function ExercisesScreen() {
  const [query, setQuery] = useState('');
  const { exercises, loading } = useExercises(query);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <Text className="px-4 pb-1 pt-2 text-2xl font-bold text-foreground">Ćwiczenia</Text>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Szukaj ćwiczenia" />
      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ExerciseRow exercise={item} />}
        ListEmptyComponent={loading ? null : <EmptyState message="Brak ćwiczeń" />}
      />
    </SafeAreaView>
  );
}
