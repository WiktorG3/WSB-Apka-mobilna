import { create } from 'zustand';

type ActiveWorkoutState = {
  workoutId: number | null;
  setWorkoutId: (id: number) => void;
  clearWorkoutId: () => void;
};

export const useActiveWorkout = create<ActiveWorkoutState>((set) => ({
  workoutId: null,
  setWorkoutId: (id) => set({ workoutId: id }),
  clearWorkoutId: () => set({ workoutId: null }),
}));
