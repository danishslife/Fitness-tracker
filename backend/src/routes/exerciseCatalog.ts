import type { Request, Response } from "express";
import { ExerciseCatalog } from "../models/exerciseCatalog";
import express from "express";
const router = express.Router();

//Getting All

router.get("/", async (req: Request, res: Response) => {
  try {
    const sortField = (req.query["sort"] as string) || "name";
    const sortOrder = parseInt((req.query["sortOrder"] as string) || "1");

    const exerciseCatalog = await ExerciseCatalog.find().sort({
      [sortField]: sortOrder as 1 | -1,
    });

    res.status(200).json({ exerciseCatalog });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    res.status(500).json({ message });
  }
});

//Creating One
router.post("/", async (req: Request, res: Response) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const targetMuscleGroup =
    typeof req.body.targetMuscleGroup === "string"
      ? req.body.targetMuscleGroup.trim()
      : "";

  if (!name || !targetMuscleGroup) {
    res.status(400).json({
      message:
        "The 'name' and 'targetMuscleGroup' fields are required and cannot be empty.",
    });
    return;
  }

  try {
    const newExerciseCatalog = await ExerciseCatalog.create({
      name,
      targetMuscleGroup,
    });
    res.status(201).json(newExerciseCatalog);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    res.status(500).json({ message });
  }
});

export default router;
