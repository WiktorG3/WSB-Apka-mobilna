import { create } from 'zustand';

import type { RoutineInput } from '@/lib/routines';

export type DraftSet = {
  targetWeight: string;
  targetReps: string;
};

export type DraftExercise = {
  exerciseId: number;
  name: string;
  restSec: string;
  sets: DraftSet[];
};

type RoutineEditorState = {
  name: string;
  exercises: DraftExercise[];
  setName: (name: string) => void;
  addExercises: (additions: { id: number; name: string }[]) => void;
  removeExercise: (index: number) => void;
  setRestSec: (exerciseIndex: number, restSec: string) => void;
  addSet: (exerciseIndex: number) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  updateSet: (exerciseIndex: number, setIndex: number, patch: Partial<DraftSet>) => void;
  init: (state: { name: string; exercises: DraftExercise[] }) => void;
  reset: () => void;
};

const emptyState = { name: '', exercises: [] as DraftExercise[] };

export const useRoutineEditor = create<RoutineEditorState>((set) => ({
  ...emptyState,
  setName: (name) => set({ name }),
  addExercises: (additions) =>
    set((state) => ({
      exercises: [
        ...state.exercises,
        ...additions.map((a) => ({
          exerciseId: a.id,
          name: a.name,
          restSec: '',
          sets: [{ targetWeight: '', targetReps: '' }],
        })),
      ],
    })),
  removeExercise: (index) =>
    set((state) => ({ exercises: state.exercises.filter((_, i) => i !== index) })),
  setRestSec: (exerciseIndex, restSec) =>
    set((state) => ({
      exercises: state.exercises.map((ex, i) =>
        i === exerciseIndex ? { ...ex, restSec } : ex,
      ),
    })),
  addSet: (exerciseIndex) =>
    set((state) => ({
      exercises: state.exercises.map((ex, i) =>
        i === exerciseIndex
          ? { ...ex, sets: [...ex.sets, { targetWeight: '', targetReps: '' }] }
          : ex,
      ),
    })),
  removeSet: (exerciseIndex, setIndex) =>
    set((state) => ({
      exercises: state.exercises.map((ex, i) =>
        i === exerciseIndex
          ? { ...ex, sets: ex.sets.filter((_, si) => si !== setIndex) }
          : ex,
      ),
    })),
  updateSet: (exerciseIndex, setIndex, patch) =>
    set((state) => ({
      exercises: state.exercises.map((ex, i) =>
        i === exerciseIndex
          ? {
              ...ex,
              sets: ex.sets.map((st, si) => (si === setIndex ? { ...st, ...patch } : st)),
            }
          : ex,
      ),
    })),
  init: (state) => set(state),
  reset: () => set(emptyState),
}));

export function buildRoutineInput(name: string, draftExercises: DraftExercise[]): RoutineInput {
  return {
    name: name.trim(),
    exercises: draftExercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      restSec: parseIntOrNull(ex.restSec),
      sets: ex.sets.map((s) => ({
        targetWeight: parseFloatOrNull(s.targetWeight),
        targetReps: parseIntOrNull(s.targetReps),
      })),
    })),
  };
}

function parseFloatOrNull(s: string): number | null {
  const normalized = s.replace(',', '.').trim();
  if (normalized === '') return null;
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}

function parseIntOrNull(s: string): number | null {
  const trimmed = s.trim();
  if (trimmed === '') return null;
  const n = parseInt(trimmed, 10);
  return Number.isFinite(n) ? n : null;
}
