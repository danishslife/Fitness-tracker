import "reflect-metadata";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import exerciseRouter from "./routes/exercise";
import exerciseCatalogRouter from "./routes/exerciseCatalog";
import authRouter from "./routes/auth";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

mongoose.connect(databaseUrl);
const db = mongoose.connection;

db.on("error", (error: unknown) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/exercise", exerciseRouter);
app.use("/api/exerciseCatalog", exerciseCatalogRouter);
app.use("/api/auth", authRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
