import { create } from 'zustand';

type State = {
  endsAt: number | null;
  exerciseName: string | null;
  start: (seconds: number, exerciseName: string) => void;
  adjust: (deltaSeconds: number) => void;
  stop: () => void;
};

export const useRestTimer = create<State>((set) => ({
  endsAt: null,
  exerciseName: null,
  start: (seconds, exerciseName) =>
    set({ endsAt: Date.now() + seconds * 1000, exerciseName }),
  adjust: (deltaSeconds) =>
    set((state) => {
      if (state.endsAt === null) return {};
      return { endsAt: state.endsAt + deltaSeconds * 1000 };
    }),
  stop: () => set({ endsAt: null, exerciseName: null }),
}));
