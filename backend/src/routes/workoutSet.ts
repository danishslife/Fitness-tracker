import type { Request, Response, NextFunction } from "express";
import express from "express";
import { z } from "zod";
import { Between } from "typeorm";
import { WorkoutSet } from "../entities/WorkoutSet";
import { Exercise } from "../entities/Exercise";
import { validateBody } from "../middlewares/schemaValidator";
import { requireAuth } from "../middlewares/requireAuth";
import { AppDataSource } from "../data-source";

const router = express.Router();

router.use(requireAuth);

const createSetSchema = z.object({
  exercise: z.number().int().positive("Exercise is required"),
  weight: z.number().positive("Weight must be greater than 0"),
  reps: z.number().positive("Reps must be greater than 0"),
  performedAt: z.iso.datetime(),
});

const editSetSchema = z.object({
  weight: z.number().positive("Weight must be greater than 0"),
  reps: z.number().positive("Reps must be greater than 0"),
});

function workoutSetRepository() {
  return AppDataSource.getRepository(WorkoutSet);
}

async function loadWorkoutSetWithExercise(id: number) {
  return workoutSetRepository().findOne({
    where: { id },
    relations: { exercise: true },
  });
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const startDate = req.query["startDate"] as string;
    const endDate = req.query["endDate"] as string;

    if (!startDate || !endDate) {
      res.status(400).json({
        message:
          "The 'startDate' and 'endDate' fields are required and cannot be empty.",
      });
      return;
    }

    const user = res.locals["user"];

    const workoutSets = await workoutSetRepository().find({
      where: {
        user: { id: user.id },
        performedAt: Between(new Date(startDate), new Date(endDate)),
      },
      relations: { exercise: true },
      order: { performedAt: "ASC", createdAt: "ASC" },
    });

    res.json({ workoutSets });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ message });
  }
});

router.post("/", validateBody(createSetSchema), async (req, res) => {
  const user = res.locals["user"];
  const exerciseId = req.body.exercise as number;

  const exercise = await AppDataSource.getRepository(Exercise).findOne({
    where: { id: exerciseId },
    relations: { user: true },
  });

  if (!exercise) {
    res.status(400).json({ message: "Invalid exercise id" });
    return;
  }

  const exerciseOwnerId = exercise.user?.id;
  if (exerciseOwnerId != null && exerciseOwnerId !== user.id) {
    res.status(400).json({ message: "Invalid exercise id" });
    return;
  }

  try {
    const saved = await workoutSetRepository().save(
      workoutSetRepository().create({
        weight: req.body.weight,
        reps: req.body.reps,
        performedAt: new Date(req.body.performedAt),
        user,
        exercise,
      }),
    );

    const withExercise = await loadWorkoutSetWithExercise(saved.id);
    res.status(201).json(withExercise);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message });
  }
});

router.get("/:id", getWorkoutSet, (_req, res) => {
  res.json(res.locals["workoutSet"]);
});

router.patch(
  "/:id",
  validateBody(editSetSchema),
  getWorkoutSet,
  async (req, res) => {
    const workoutSet = res.locals["workoutSet"] as WorkoutSet;

    if (req.body.weight != null) {
      workoutSet.weight = req.body.weight;
    }
    if (req.body.reps != null) {
      workoutSet.reps = req.body.reps;
    }

    try {
      const updated = await workoutSetRepository().save(workoutSet);
      const reloaded = await loadWorkoutSetWithExercise(updated.id);
      res.json(reloaded);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      res.status(400).json({ message });
    }
  },
);

router.delete("/:id", getWorkoutSet, async (_req, res) => {
  try {
    const workoutSet = res.locals["workoutSet"] as WorkoutSet;
    await workoutSetRepository().remove(workoutSet);
    res.json({ message: "workout set deleted" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ message });
  }
});

async function getWorkoutSet(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params["id"]);

  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    return res.status(400).json({ message: "Invalid ID format provided" });
  }

  try {
    const user = res.locals["user"];

    const workoutSet = await workoutSetRepository().findOne({
      where: { id, user: { id: user.id } },
      relations: { exercise: true },
    });

    if (workoutSet == null) {
      return res.status(404).json({ message: "workout set not found" });
    }

    res.locals["workoutSet"] = workoutSet;
    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return res.status(500).json({ message });
  }
}

export default router;
