import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { User } from "./entities/User";
import { Exercise } from "./entities/Exercise";
import { WorkoutSet } from "./entities/WorkoutSet";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  entities: [User, Exercise, WorkoutSet],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === "true",
  namingStrategy: new SnakeNamingStrategy(),
});
