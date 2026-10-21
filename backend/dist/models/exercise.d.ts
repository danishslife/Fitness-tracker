import { type Ref } from "@typegoose/typegoose";
import { ExerciseCatalogSchema } from "./exerciseCatalog";
import { UserSchema } from "./user";
declare class ExerciseSchema {
    exerciseCatalog: Ref<ExerciseCatalogSchema>;
    user: Ref<UserSchema>;
    weight: number;
    reps: number;
    performedAt: Date;
}
export declare const Exercise: import("@typegoose/typegoose").ReturnModelType<typeof ExerciseSchema, import("@typegoose/typegoose/lib/types").BeAnObject>;
export {};
//# sourceMappingURL=exercise.d.ts.map