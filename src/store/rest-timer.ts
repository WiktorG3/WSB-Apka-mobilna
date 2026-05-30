import { create } from 'zustand';

type State = {
  endsAt: number | null;
  exerciseName: string | null;
  start: (seconds: number, exerciseName: string) => void;
  stop: () => void;
};

export const useRestTimer = create<State>((set) => ({
  endsAt: null,
  exerciseName: null,
  start: (seconds, exerciseName) =>
    set({ endsAt: Date.now() + seconds * 1000, exerciseName }),
  stop: () => set({ endsAt: null, exerciseName: null }),
}));
