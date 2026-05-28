import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const muscleGroups = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
  "other",
] as const;
export const equipmentTypes = [
  "barbell",
  "dumbbell",
  "machine",
  "cable",
  "bodyweight",
  "other",
] as const;

// katalog cwiczen
export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  muscleGroup: text("muscle_group", { enum: muscleGroups }).notNull(),
  equipment: text("equipment", { enum: equipmentTypes }).notNull(),
  isCustom: integer("is_custom", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// plany / rutyny
export const routines = sqliteTable("routines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// cwiczenia w rutynie
export const routineExercises = sqliteTable("routine_exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  routineId: integer("routine_id")
    .notNull()
    .references(() => routines.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "restrict" }),
  position: integer("position").notNull(),
  restSec: integer("rest_sec"),
});

// zaplanowane serie w rutynie
export const routineSets = sqliteTable("routine_sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  routineExerciseId: integer("routine_exercise_id")
    .notNull()
    .references(() => routineExercises.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  targetWeight: real("target_weight"),
  targetReps: integer("target_reps"),
});

// zrobione treningi
export const workouts = sqliteTable("workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  routineId: integer("routine_id").references(() => routines.id, {
    onDelete: "set null",
  }),
  startedAt: integer("started_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  finishedAt: integer("finished_at", { mode: "timestamp_ms" }),
  durationSec: integer("duration_sec"),
  totalVolume: real("total_volume"),
});

// cwiczenia w treningu
export const workoutExercises = sqliteTable("workout_exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "restrict" }),
  position: integer("position").notNull(),
});

// zrobione serie w treningu
export const sets = sqliteTable("sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutExerciseId: integer("workout_exercise_id")
    .notNull()
    .references(() => workoutExercises.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  weight: real("weight").notNull().default(0),
  reps: integer("reps").notNull().default(0),
  isDone: integer("is_done", { mode: "boolean" }).notNull().default(false),
});

export const exercisesRelations = relations(exercises, ({ many }) => ({
  routineExercises: many(routineExercises),
  workoutExercises: many(workoutExercises),
}));

export const routinesRelations = relations(routines, ({ many }) => ({
  exercises: many(routineExercises),
}));

export const routineExercisesRelations = relations(
  routineExercises,
  ({ one, many }) => ({
    routine: one(routines, {
      fields: [routineExercises.routineId],
      references: [routines.id],
    }),
    exercise: one(exercises, {
      fields: [routineExercises.exerciseId],
      references: [exercises.id],
    }),
    sets: many(routineSets),
  }),
);

export const routineSetsRelations = relations(routineSets, ({ one }) => ({
  routineExercise: one(routineExercises, {
    fields: [routineSets.routineExerciseId],
    references: [routineExercises.id],
  }),
}));

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  routine: one(routines, {
    fields: [workouts.routineId],
    references: [routines.id],
  }),
  exercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
    sets: many(sets),
  }),
);

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

export type MuscleGroup = (typeof muscleGroups)[number];
export type Equipment = (typeof equipmentTypes)[number];

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type Routine = typeof routines.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type WorkoutSet = typeof sets.$inferSelect;
