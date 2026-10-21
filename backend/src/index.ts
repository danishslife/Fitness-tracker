import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import exerciseRouter from "./routes/exercise";
import exerciseCatalogRouter from "./routes/exerciseCatalog";
import authRouter from "./routes/auth";
import { AppDataSource } from "./data-source";

async function main() {
  await AppDataSource.initialize();
  console.log("Connected to Database");

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/exercise", exerciseRouter);
  app.use("/api/exerciseCatalog", exerciseCatalogRouter);
  app.use("/api/auth", authRouter);

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

main().catch((error) => {
  console.error("Failed to start", error);
  process.exit(1);
});
