import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ExerciseRow } from '@/components/exercise-row';
import { FilterButton } from '@/components/filter-button';
import { FilterSheet } from '@/components/filter-sheet';
import { PrimaryButton } from '@/components/primary-button';
import { SearchBar } from '@/components/search-bar';
import { equipmentLabels, muscleGroupLabels } from '@/constants/labels';
import { palette } from '@/constants/theme';
import { equipmentTypes, muscleGroups, type Equipment, type MuscleGroup } from '@/db/schema';
import { useExercises } from '@/hooks/use-exercises';

const muscleOptions: { value: MuscleGroup | null; label: string }[] = [
  { value: null, label: 'Wszystkie partie' },
  ...muscleGroups.map((g) => ({ value: g, label: muscleGroupLabels[g] })),
];

const equipmentOptions: { value: Equipment | null; label: string }[] = [
  { value: null, label: 'Cały sprzęt' },
  ...equipmentTypes.map((e) => ({ value: e, label: equipmentLabels[e] })),
];

export default function ExercisesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [openSheet, setOpenSheet] = useState<'muscle' | 'equipment' | null>(null);
  const { exercises, loading } = useExercises(query);

  const filtered = exercises.filter(
    (ex) =>
      (!muscleGroup || ex.muscleGroup === muscleGroup) &&
      (!equipment || ex.equipment === equipment),
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <Text className="px-4 pb-1 pt-2 text-2xl font-bold text-foreground">Ćwiczenia</Text>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Szukaj ćwiczenia" />

      <View className="flex-row gap-2 px-4 py-2">
        <FilterButton
          label={muscleGroup ? muscleGroupLabels[muscleGroup] : 'Wszystkie partie'}
          active={muscleGroup !== null}
          onPress={() => setOpenSheet('muscle')}
        />
        <FilterButton
          label={equipment ? equipmentLabels[equipment] : 'Cały sprzęt'}
          active={equipment !== null}
          onPress={() => setOpenSheet('equipment')}
        />
      </View>

      <PrimaryButton title="Dodaj własne ćwiczenie" onPress={() => router.push('/add-exercise')} />
      <FlatList
        data={filtered}
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
              hint="Spróbuj innego wyszukiwania lub zmień filtry"
            />
          )
        }
      />

      <FilterSheet
        visible={openSheet === 'muscle'}
        title="Partia mięśniowa"
        options={muscleOptions}
        current={muscleGroup}
        onSelect={setMuscleGroup}
        onClose={() => setOpenSheet(null)}
      />
      <FilterSheet
        visible={openSheet === 'equipment'}
        title="Sprzęt"
        options={equipmentOptions}
        current={equipment}
        onSelect={setEquipment}
        onClose={() => setOpenSheet(null)}
      />
    </SafeAreaView>
  );
}
