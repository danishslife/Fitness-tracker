import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class ExerciseCatalogSchema {
  @prop({ required: true, unique: true })
  public name!: string;

  @prop({ required: true })
  public targetMuscleGroup!: string;
}

export const ExerciseCatalog = getModelForClass(ExerciseCatalogSchema);
