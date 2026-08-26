import { type Ref } from "@typegoose/typegoose";
import { ExerciseCatalogSchema } from "./exerciseCatalog";
declare class ExerciseSchema {
    exerciseCatalog: Ref<ExerciseCatalogSchema>;
    weight: number;
    reps: number;
}
export declare const Exercise: import("@typegoose/typegoose").ReturnModelType<typeof ExerciseSchema, import("@typegoose/typegoose/lib/types").BeAnObject>;
export {};
//# sourceMappingURL=exercise.d.ts.map