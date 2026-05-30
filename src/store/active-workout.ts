import { create } from 'zustand';

export type ActiveWorkout = {
  id: number;
  name: string;
  startedAt: number;
};

type State = {
  active: ActiveWorkout | null;
  setActive: (workout: ActiveWorkout) => void;
  clear: () => void;
};

export const useActiveWorkout = create<State>((set) => ({
  active: null,
  setActive: (active) => set({ active }),
  clear: () => set({ active: null }),
}));
