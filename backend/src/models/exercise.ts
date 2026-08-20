import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
class ExerciseSchema {
  @prop({ required: true })
  public name!: string;

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
