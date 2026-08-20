import type { Request, Response, NextFunction } from "express";
import express from "express";
import { Exercise } from "../models/exercise";
const router = express.Router();

//Getting all
router.get("/", async (req: Request, res: Response) => {
  try {
    const startDate = req.query["startDate"] as string;
    const endDate = req.query["endDate"] as string;

    if (!startDate || !endDate) {
      res
        .status(400)
        .json({
          message:
            "The 'startDate' and 'endDate' fields are required and cannot be empty.",
        });
      return;
    }
    const sortField = (req.query["sort"] as string) || "name";
    const sortOrder = parseInt((req.query["sortOrder"] as string) || "1");
    const page = Number(req.query["page"]) || 1;
    const pageLimit = Number(req.query["pageLimit"]) || 10;
    const skip = (page - 1) * pageLimit;
    const filter: Record<string, unknown> = {};

    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }
    filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const exercises = await Exercise.find(filter)
      .sort({ [sortField]: sortOrder as 1 | -1 })
      .skip(skip)
      .limit(pageLimit);

    const count = await Exercise.countDocuments(filter);
    res.json({ count, exercises });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ message });
  }
});

//Getting One
router.get("/:id", getExercise, (req, res) => {
  res.json(res.locals["exercise"]);
});

//Creating One
router.post("/", async (req, res) => {
  const exercise = new Exercise({
    name: req.body.name,
    weight: req.body.weight,
    reps: req.body.reps,
  });
  try {
    const newExercise = await exercise.save();
    res.status(201).json(newExercise);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message });
  }
});

//Upating One
router.patch("/:id", getExercise, async (req, res) => {
  if (req.body.name != null) {
    res.locals["exercise"].name = req.body.name;
  }
  if (req.body.weight != null) {
    res.locals["exercise"].weight = req.body.weight;
  }
  if (req.body.reps != null) {
    res.locals["exercise"].reps = req.body.reps;
  }

  try {
    const updatedExercise = await res.locals["exercise"].save();
    res.json(updatedExercise);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message });
  }
});

//Deleting One
router.delete("/:id", getExercise, async (req, res) => {
  try {
    await res.locals["exercise"].deleteOne();
    res.json({ message: "exercise deleted" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ message });
  }
});

async function getExercise(req: Request, res: Response, next: NextFunction) {
  let exercise;
  try {
    exercise = await Exercise.findById(req.params.id);
    if (exercise == null) {
      return res.status(404).json({ message: "exercise not found" });
    }
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format provided" });
    }
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return res.status(500).json({ message });
  }

  res.locals["exercise"] = exercise;
  next();
}

export default router;
