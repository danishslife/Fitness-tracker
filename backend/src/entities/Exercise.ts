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
import { ExerciseCatalog } from "./ExerciseCatalog";

@Entity("exercise")
export class Exercise {
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

  @ManyToOne(() => User, (user) => user.exercises, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(
    () => ExerciseCatalog,
    (exerciseCatalog) => exerciseCatalog.exercises,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: "exercise_catalog_id" })
  exerciseCatalog!: ExerciseCatalog;
}
