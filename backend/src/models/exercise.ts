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

  @prop({ required: true })
  public performedAt!: Date;
}

export const Exercise = getModelForClass(ExerciseSchema);


