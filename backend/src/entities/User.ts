import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Exercise } from "./Exercise";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "first_name", type: "text", nullable: false })
  firstName!: string;

  @Column({ name: "last_name", type: "text", nullable: false })
  lastName!: string;

  @Column({ type: "text", unique: true, nullable: false })
  email!: string;

  @Column({ type: "text", nullable: false })
  password!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => Exercise, (exercise) => exercise.user)
  exercises!: Exercise[];
}
