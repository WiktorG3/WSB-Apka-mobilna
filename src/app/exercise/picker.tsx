import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExercisePickerRow } from '@/components/exercise-picker-row';
import { SearchBar } from '@/components/search-bar';
import { useExercises } from '@/hooks/use-exercises';
import { useRoutineEditor } from '@/store/routine-editor';

type Selection = { id: number; name: string };

export default function ExercisePickerScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Selection[]>([]);
  const { exercises } = useExercises(query);
  const addExercises = useRoutineEditor((s) => s.addExercises);

  const isSelected = (id: number) => selected.some((s) => s.id === id);

  const toggle = (id: number, name: string) => {
    setSelected((prev) =>
      prev.some((s) => s.id === id) ? prev.filter((s) => s.id !== id) : [...prev, { id, name }],
    );
  };

  const handleAdd = () => {
    if (selected.length === 0) return;
    addExercises(selected);
    router.back();
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: 'Wybierz ćwiczenia',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="px-3">
              <Text className="text-base text-primary">Anuluj</Text>
            </Pressable>
          ),
        }}
      />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Szukaj ćwiczenia" />
      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ExercisePickerRow
            exercise={item}
            selected={isSelected(item.id)}
            onToggle={() => toggle(item.id, item.name)}
          />
        )}
      />
      <Pressable
        onPress={handleAdd}
        disabled={selected.length === 0}
        className={`mx-4 my-3 items-center rounded-lg py-3 ${selected.length === 0 ? 'bg-card opacity-50' : 'bg-primary active:opacity-80'}`}>
        <Text className="text-base font-semibold text-foreground">
          {selected.length === 0 ? 'Dodaj' : `Dodaj (${selected.length})`}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
