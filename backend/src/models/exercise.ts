import { getModelForClass, prop, modelOptions, type Ref } from "@typegoose/typegoose";
import { ExerciseCatalogSchema } from "./exerciseCatalog";
import { UserSchema } from "./user";

@modelOptions({ schemaOptions: { timestamps: true } })
class ExerciseSchema {
  @prop({ required: true, ref: () => ExerciseCatalogSchema })
  public exerciseCatalog!: Ref<ExerciseCatalogSchema>;

  @prop({ required: true, ref: () => UserSchema })
  public user!: Ref<UserSchema>;

  @prop({ required: true })
  public weight!: number;

  @prop({ required: true })
  public reps!: number;
}

export const Exercise = getModelForClass(ExerciseSchema);

// async function seed() {
//   try {
//     // Optional: wipe existing data first
//     await Course.deleteMany({});
//     console.log("Cleared existing courses", courses.length);

//     const created = await Course.insertMany(courses);
//     console.log(`Seeded ${created.length} courses`);
//   } catch (err) {
//     console.error("Seeding failed:", err);
//   }
// }

// seed();
