// Database schema types for TypeScript
export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  height: number | null;
  weight: number | null;
  goal: string | null;
  created_at: string;
  updated_at: string;
};

export type Exercise = {
  id: string;
  name: string;
  description: string | null;
  muscle_group: string;
  equipment: string | null;
  difficulty: string | null;
  instructions: string | null;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Workout = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  duration: number | null;
  difficulty: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type WorkoutExercise = {
  id: string;
  workout_id: string;
  exercise_id: string;
  sets: number;
  reps: number | null;
  duration: number | null;
  rest_time: number | null;
  order_index: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type WorkoutLog = {
  id: string;
  user_id: string;
  workout_id: string | null;
  started_at: string;
  completed_at: string | null;
  duration: number | null;
  notes: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
};

export type ExerciseLog = {
  id: string;
  workout_log_id: string;
  exercise_id: string | null;
  sets_completed: number;
  reps_completed: number | null;
  weight: number | null;
  duration_completed: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  date: string;
  weight: number | null;
  body_fat_percentage: number | null;
  muscle_mass: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
