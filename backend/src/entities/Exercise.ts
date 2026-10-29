import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { WorkoutSet } from "./WorkoutSet";
import { User } from "./User";

@Entity("exercise_catalog")
export class Exercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", nullable: false })
  name!: string;

  @Column({ name: "target_muscle_group", type: "text", nullable: false })
  targetMuscleGroup!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User | null;

  @OneToMany(() => WorkoutSet, (workoutSet) => workoutSet.exercise)
  workoutSets!: WorkoutSet[];
}
