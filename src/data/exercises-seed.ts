import type { Equipment, MuscleGroup } from '@/db/schema';

export type ExerciseSeed = {
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
};

export const exercisesSeed: readonly ExerciseSeed[] = [
  { name: 'Wyciskanie sztangi na ławce płaskiej', muscleGroup: 'chest', equipment: 'barbell' },
  { name: 'Wyciskanie hantli na ławce płaskiej', muscleGroup: 'chest', equipment: 'dumbbell' },
  { name: 'Wyciskanie sztangi na ławce skośnej', muscleGroup: 'chest', equipment: 'barbell' },
  { name: 'Wyciskanie hantli na ławce skośnej', muscleGroup: 'chest', equipment: 'dumbbell' },
  { name: 'Rozpiętki z hantlami', muscleGroup: 'chest', equipment: 'dumbbell' },
  { name: 'Krzyżowanie linek wyciągu', muscleGroup: 'chest', equipment: 'cable' },
  { name: 'Pompki', muscleGroup: 'chest', equipment: 'bodyweight' },
  { name: 'Wyciskanie na maszynie', muscleGroup: 'chest', equipment: 'machine' },
  { name: 'Pompki szerokie', muscleGroup: 'chest', equipment: 'bodyweight' },
  { name: 'Pompki z nogami na podwyższeniu', muscleGroup: 'chest', equipment: 'bodyweight' },
  { name: 'Pompki diamentowe', muscleGroup: 'chest', equipment: 'bodyweight' },

  { name: 'Martwy ciąg', muscleGroup: 'back', equipment: 'barbell' },
  { name: 'Podciąganie na drążku', muscleGroup: 'back', equipment: 'bodyweight' },
  { name: 'Wiosłowanie sztangą', muscleGroup: 'back', equipment: 'barbell' },
  { name: 'Wiosłowanie hantlą', muscleGroup: 'back', equipment: 'dumbbell' },
  { name: 'Ściąganie drążka wyciągu górnego', muscleGroup: 'back', equipment: 'cable' },
  { name: 'Wiosłowanie na wyciągu dolnym', muscleGroup: 'back', equipment: 'cable' },
  { name: 'Wiosłowanie na maszynie', muscleGroup: 'back', equipment: 'machine' },

  { name: 'Przysiad ze sztangą', muscleGroup: 'legs', equipment: 'barbell' },
  { name: 'Rumuński martwy ciąg', muscleGroup: 'legs', equipment: 'barbell' },
  { name: 'Wyciskanie nogami na suwnicy', muscleGroup: 'legs', equipment: 'machine' },
  { name: 'Prostowanie nóg na maszynie', muscleGroup: 'legs', equipment: 'machine' },
  { name: 'Uginanie nóg leżąc na maszynie', muscleGroup: 'legs', equipment: 'machine' },
  { name: 'Wspięcia na palce stojąc', muscleGroup: 'legs', equipment: 'machine' },
  { name: 'Wykroki z hantlami', muscleGroup: 'legs', equipment: 'dumbbell' },
  { name: 'Przysiad bułgarski', muscleGroup: 'legs', equipment: 'dumbbell' },
  { name: 'Przysiady bez obciążenia', muscleGroup: 'legs', equipment: 'bodyweight' },
  { name: 'Mostek biodrowy', muscleGroup: 'legs', equipment: 'bodyweight' },

  { name: 'Wyciskanie żołnierskie', muscleGroup: 'shoulders', equipment: 'barbell' },
  { name: 'Wyciskanie hantli nad głowę', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { name: 'Wznosy bokiem z hantlami', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { name: 'Wznosy hantli w opadzie', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { name: 'Podciąganie sztangi wzdłuż tułowia', muscleGroup: 'shoulders', equipment: 'barbell' },
  { name: 'Face pull', muscleGroup: 'shoulders', equipment: 'cable' },
  { name: 'Pompki pike', muscleGroup: 'shoulders', equipment: 'bodyweight' },

  { name: 'Uginanie ramion ze sztangą', muscleGroup: 'arms', equipment: 'barbell' },
  { name: 'Uginanie ramion z hantlami', muscleGroup: 'arms', equipment: 'dumbbell' },
  { name: 'Uginanie młotkowe z hantlami', muscleGroup: 'arms', equipment: 'dumbbell' },
  { name: 'Uginanie ramion na modlitewniku', muscleGroup: 'arms', equipment: 'machine' },
  { name: 'Prostowanie ramion na wyciągu', muscleGroup: 'arms', equipment: 'cable' },
  { name: 'Wyciskanie francuskie', muscleGroup: 'arms', equipment: 'barbell' },
  { name: 'Dipy na poręczach', muscleGroup: 'arms', equipment: 'bodyweight' },

  { name: 'Deska (plank)', muscleGroup: 'core', equipment: 'bodyweight' },
  { name: 'Brzuszki', muscleGroup: 'core', equipment: 'bodyweight' },
  { name: 'Unoszenie nóg w zwisie', muscleGroup: 'core', equipment: 'bodyweight' },
  { name: 'Russian twist', muscleGroup: 'core', equipment: 'bodyweight' },
  { name: 'Spięcia brzucha na wyciągu', muscleGroup: 'core', equipment: 'cable' },
  { name: 'Mountain climbers', muscleGroup: 'core', equipment: 'bodyweight' },

  { name: 'Burpees', muscleGroup: 'other', equipment: 'bodyweight' },
];
