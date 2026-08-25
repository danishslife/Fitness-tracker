import "reflect-metadata";
import "dotenv/config";
import mongoose from "mongoose";
import { Exercise } from "../models/exercise";
import { ExerciseCatalog } from "../models/exerciseCatalog";

const sampleCatalog = [
  { name: "Bench Press", targetMuscleGroup: "Chest" },
  { name: "Bicep Curls", targetMuscleGroup: "Biceps" },
  { name: "Squat", targetMuscleGroup: "Quads" },
  { name: "Deadlift", targetMuscleGroup: "Back" },
  { name: "Overhead Press", targetMuscleGroup: "Shoulders" },
];

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  await mongoose.connect(databaseUrl);

  const deletedSets = await Exercise.deleteMany({});
  const deletedCatalog = await ExerciseCatalog.deleteMany({});

  const created = await ExerciseCatalog.insertMany(sampleCatalog);

  console.log(
    `Cleared ${deletedSets.deletedCount} set(s) and ${deletedCatalog.deletedCount} catalog row(s). Seeded ${created.length} catalog exercise(s).`,
  );

  await mongoose.disconnect();
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
