import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Exercise } from "./Exercise";

@Entity("exercise")
export class WorkoutSet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "integer", nullable: false })
  weight!: number;

  @Column({ type: "integer", nullable: false })
  reps!: number;

  @Column({ name: "performed_at", type: "timestamptz", nullable: false })
  performedAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.workoutSets, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Exercise, (exercise) => exercise.workoutSets, {
    nullable: false,
  })
  @JoinColumn({ name: "exercise_catalog_id" })
  exercise!: Exercise;
}
