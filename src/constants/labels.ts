import type { Equipment, MuscleGroup } from '@/db/schema';

export const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: 'Klatka piersiowa',
  back: 'Plecy',
  legs: 'Nogi',
  shoulders: 'Barki',
  arms: 'Ramiona',
  core: 'Brzuch',
  other: 'Inne',
};

export const equipmentLabels: Record<Equipment, string> = {
  barbell: 'Sztanga',
  dumbbell: 'Hantle',
  machine: 'Maszyna',
  cable: 'Wyciąg',
  bodyweight: 'Masa ciała',
  other: 'Inne',
};
