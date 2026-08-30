import "reflect-metadata";
import "dotenv/config";
import mongoose from "mongoose";
import { Exercise } from "../models/exercise";

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  await mongoose.connect(databaseUrl);

  const result = await Exercise.collection.updateMany(
    { performedAt: { $exists: false } },
    [{ $set: { performedAt: "$createdAt" } }],
  );

  console.log(`Backfilled performedAt on ${result.modifiedCount} set(s).`);
  await mongoose.disconnect();
}

migrate().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
