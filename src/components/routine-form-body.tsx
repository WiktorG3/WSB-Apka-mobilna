import { PrimaryButton } from '@/components/primary-button';
import { RoutineExerciseCard } from '@/components/routine-exercise-card';
import { TextField } from '@/components/text-field';
import { useRoutineEditor } from '@/store/routine-editor';

type Props = {
  onAddExercise: () => void;
};

export function RoutineFormBody({ onAddExercise }: Props) {
  const name = useRoutineEditor((s) => s.name);
  const exercises = useRoutineEditor((s) => s.exercises);
  const setName = useRoutineEditor((s) => s.setName);
  const removeExercise = useRoutineEditor((s) => s.removeExercise);
  const setRestSec = useRoutineEditor((s) => s.setRestSec);
  const addSet = useRoutineEditor((s) => s.addSet);
  const removeSet = useRoutineEditor((s) => s.removeSet);
  const updateSet = useRoutineEditor((s) => s.updateSet);

  return (
    <>
      <TextField
        label="Nazwa rutyny"
        value={name}
        onChangeText={setName}
        placeholder="np. Trening A - klatka i tricepsy"
      />

      {exercises.map((exercise, index) => (
        <RoutineExerciseCard
          key={`${exercise.exerciseId}-${index}`}
          exercise={exercise}
          onRemove={() => removeExercise(index)}
          onChangeRestSec={(t) => setRestSec(index, t)}
          onAddSet={() => addSet(index)}
          onChangeSetWeight={(setIdx, t) => updateSet(index, setIdx, { targetWeight: t })}
          onChangeSetReps={(setIdx, t) => updateSet(index, setIdx, { targetReps: t })}
          onRemoveSet={(setIdx) => removeSet(index, setIdx)}
        />
      ))}

      <PrimaryButton title="Dodaj ćwiczenie" onPress={onAddExercise} />
    </>
  );
}
