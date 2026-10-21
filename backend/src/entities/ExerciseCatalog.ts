import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Exercise } from "./Exercise";

@Entity("exercise_catalog")
export class ExerciseCatalog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true, nullable: false })
  name!: string;

  @Column({ name: "target_muscle_group", type: "text", nullable: false })
  targetMuscleGroup!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => Exercise, (exercise) => exercise.exerciseCatalog)
  exercises!: Exercise[];
}
