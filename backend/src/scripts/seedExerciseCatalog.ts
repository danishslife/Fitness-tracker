import "reflect-metadata";
import "dotenv/config";
import mongoose from "mongoose";
import { ExerciseCatalog } from "../models/exerciseCatalog";

const sampleCatalog = [
  // Chest
  { name: "Bench Press", targetMuscleGroup: "Chest" },
  { name: "Incline Bench Press", targetMuscleGroup: "Chest" },
  { name: "Decline Bench Press", targetMuscleGroup: "Chest" },
  { name: "Dumbbell Bench Press", targetMuscleGroup: "Chest" },
  { name: "Incline Dumbbell Press", targetMuscleGroup: "Chest" },
  { name: "Chest Fly", targetMuscleGroup: "Chest" },
  { name: "Cable Crossover", targetMuscleGroup: "Chest" },
  { name: "Push-Up", targetMuscleGroup: "Chest" },
  { name: "Chest Dip", targetMuscleGroup: "Chest" },

  // Back
  { name: "Deadlift", targetMuscleGroup: "Back" },
  { name: "Barbell Row", targetMuscleGroup: "Back" },
  { name: "Pull-Up", targetMuscleGroup: "Back" },
  { name: "Chin-Up", targetMuscleGroup: "Back" },
  { name: "Lat Pulldown", targetMuscleGroup: "Back" },
  { name: "Seated Cable Row", targetMuscleGroup: "Back" },
  { name: "T-Bar Row", targetMuscleGroup: "Back" },
  { name: "Dumbbell Row", targetMuscleGroup: "Back" },
  { name: "Face Pull", targetMuscleGroup: "Back" },
  { name: "Hyperextension", targetMuscleGroup: "Back" },

  // Shoulders
  { name: "Overhead Press", targetMuscleGroup: "Shoulders" },
  { name: "Dumbbell Shoulder Press", targetMuscleGroup: "Shoulders" },
  { name: "Arnold Press", targetMuscleGroup: "Shoulders" },
  { name: "Lateral Raise", targetMuscleGroup: "Shoulders" },
  { name: "Front Raise", targetMuscleGroup: "Shoulders" },
  { name: "Reverse Fly", targetMuscleGroup: "Shoulders" },
  { name: "Upright Row", targetMuscleGroup: "Shoulders" },
  { name: "Shrugs", targetMuscleGroup: "Shoulders" },

  // Biceps
  { name: "Bicep Curls", targetMuscleGroup: "Biceps" },
  { name: "Hammer Curl", targetMuscleGroup: "Biceps" },
  { name: "Preacher Curl", targetMuscleGroup: "Biceps" },
  { name: "Concentration Curl", targetMuscleGroup: "Biceps" },
  { name: "Cable Curl", targetMuscleGroup: "Biceps" },
  { name: "Incline Dumbbell Curl", targetMuscleGroup: "Biceps" },

  // Triceps
  { name: "Tricep Pushdown", targetMuscleGroup: "Triceps" },
  { name: "Skull Crusher", targetMuscleGroup: "Triceps" },
  { name: "Overhead Tricep Extension", targetMuscleGroup: "Triceps" },
  { name: "Close-Grip Bench Press", targetMuscleGroup: "Triceps" },
  { name: "Tricep Dip", targetMuscleGroup: "Triceps" },
  { name: "Kickback", targetMuscleGroup: "Triceps" },

  // Quads
  { name: "Squat", targetMuscleGroup: "Quads" },
  { name: "Front Squat", targetMuscleGroup: "Quads" },
  { name: "Leg Press", targetMuscleGroup: "Quads" },
  { name: "Lunge", targetMuscleGroup: "Quads" },
  { name: "Walking Lunge", targetMuscleGroup: "Quads" },
  { name: "Leg Extension", targetMuscleGroup: "Quads" },
  { name: "Bulgarian Split Squat", targetMuscleGroup: "Quads" },
  { name: "Hack Squat", targetMuscleGroup: "Quads" },
  { name: "Step-Up", targetMuscleGroup: "Quads" },

  // Hamstrings
  { name: "Romanian Deadlift", targetMuscleGroup: "Hamstrings" },
  { name: "Leg Curl", targetMuscleGroup: "Hamstrings" },
  { name: "Good Morning", targetMuscleGroup: "Hamstrings" },
  { name: "Nordic Curl", targetMuscleGroup: "Hamstrings" },

  // Glutes
  { name: "Hip Thrust", targetMuscleGroup: "Glutes" },
  { name: "Glute Bridge", targetMuscleGroup: "Glutes" },
  { name: "Cable Kickback", targetMuscleGroup: "Glutes" },

  // Calves
  { name: "Standing Calf Raise", targetMuscleGroup: "Calves" },
  { name: "Seated Calf Raise", targetMuscleGroup: "Calves" },

  // Core
  { name: "Plank", targetMuscleGroup: "Core" },
  { name: "Crunch", targetMuscleGroup: "Core" },
  { name: "Hanging Leg Raise", targetMuscleGroup: "Core" },
  { name: "Russian Twist", targetMuscleGroup: "Core" },
  { name: "Ab Wheel Rollout", targetMuscleGroup: "Core" },
  { name: "Cable Woodchop", targetMuscleGroup: "Core" },

  // Full body / conditioning
  { name: "Kettlebell Swing", targetMuscleGroup: "Full Body" },
  { name: "Clean and Press", targetMuscleGroup: "Full Body" },
  { name: "Farmer's Walk", targetMuscleGroup: "Full Body" },
  { name: "Battle Ropes", targetMuscleGroup: "Full Body" },
];

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  await mongoose.connect(databaseUrl);

  let inserted = 0;
  let skipped = 0;

  for (const item of sampleCatalog) {
    const result = await ExerciseCatalog.updateOne(
      { name: item.name },
      { $setOnInsert: item },
      { upsert: true },
    );

    if (result.upsertedCount > 0) {
      inserted += 1;
    } else {
      skipped += 1;
    }
  }

  console.log(
    `Seeded catalog: ${inserted} new exercise(s) added, ${skipped} already existed.`,
  );

  await mongoose.disconnect();
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
