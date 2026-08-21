import "reflect-metadata";
import "dotenv/config";
import mongoose from "mongoose";
import { Exercise } from "../models/exercise";
import { ExerciseCatalog } from "../models/exerciseCatalog";

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  await mongoose.connect(databaseUrl);

  try {
    await Exercise.collection.dropIndex("name_1");
    console.log("Dropped leftover unique index name_1 from exercises.");
  } catch (error: unknown) {
    const code = (error as { code?: number }).code;
    if (code !== 27) {
      throw error;
    }
  }

  const oldDocs = await Exercise.collection
    .find({
      $or: [{ name: { $exists: true } }, { exerciseCatalog: { $exists: false } }],
    })
    .toArray();

  let migrated = 0;
  let cleaned = 0;
  let deleted = 0;

  for (const doc of oldDocs) {
    const hasCatalogRef = Boolean(doc.exerciseCatalog);
    const name = typeof doc.name === "string" ? doc.name.trim() : "";

    if (hasCatalogRef) {
      await Exercise.collection.updateOne(
        { _id: doc._id },
        { $unset: { name: "" } },
      );
      cleaned += 1;
      continue;
    }

    if (!name) {
      await Exercise.collection.deleteOne({ _id: doc._id });
      deleted += 1;
      continue;
    }

    let catalog = await ExerciseCatalog.findOne({ name });
    if (!catalog) {
      catalog = await ExerciseCatalog.create({
        name,
        targetMuscleGroup: "Unspecified",
      });
    }

    await Exercise.collection.updateOne(
      { _id: doc._id },
      {
        $set: { exerciseCatalog: catalog._id },
        $unset: { name: "" },
      },
    );
    migrated += 1;
  }

  console.log(
    `Migration complete. Linked ${migrated} set(s), removed leftover name from ${cleaned} set(s), deleted ${deleted} invalid set(s).`,
  );

  await mongoose.disconnect();
}

migrate().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
