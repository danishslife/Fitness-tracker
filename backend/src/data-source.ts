import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { User } from "./entities/User";
import { ExerciseCatalog } from "./entities/ExerciseCatalog";
import { Exercise } from "./entities/Exercise";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  entities: [User, ExerciseCatalog, Exercise],
  synchronize: true,
  logging: process.env.TYPEORM_LOGGING === "true",
  namingStrategy: new SnakeNamingStrategy(),
});
