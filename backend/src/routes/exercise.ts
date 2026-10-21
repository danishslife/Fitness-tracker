import type { Request, Response, NextFunction } from "express";
import express from "express";
import { z } from "zod";
import { Between } from "typeorm";
import { Exercise } from "../entities/Exercise";
import { ExerciseCatalog } from "../entities/ExerciseCatalog";
import { validateBody } from "../middlewares/schemaValidator";
import { requireAuth } from "../middlewares/requireAuth";
import { AppDataSource } from "../data-source";

const router = express.Router();

router.use(requireAuth);

const createSetSchema = z.object({
  exerciseCatalog: z
    .number()
    .int()
    .positive("Exercise is required"),
  weight: z.number().positive("Weight must be greater than 0"),
  reps: z.number().positive("Reps must be greater than 0"),
  performedAt: z.iso.datetime(),
});

const editSetSchema = z.object({
  weight: z.number().positive("Weight must be greater than 0"),
  reps: z.number().positive("Reps must be greater than 0"),
});

function exerciseRepository() {
  return AppDataSource.getRepository(Exercise);
}

async function loadExerciseWithCatalog(id: number) {
  return exerciseRepository().findOne({
    where: { id },
    relations: { exerciseCatalog: true },
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

    const exercises = await exerciseRepository().find({
      where: {
        user: { id: user.id },
        performedAt: Between(new Date(startDate), new Date(endDate)),
      },
      relations: { exerciseCatalog: true },
      order: { performedAt: "ASC", createdAt: "ASC" },
    });

    res.json({ exercises });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ message });
  }
});

router.post("/", validateBody(createSetSchema), async (req, res) => {
  const user = res.locals["user"];
  const catalogId = req.body.exerciseCatalog as number;

  const catalog = await AppDataSource.getRepository(
    ExerciseCatalog,
  ).findOneBy({ id: catalogId });

  if (!catalog) {
    res.status(400).json({ message: "Invalid exercise catalog id" });
    return;
  }

  try {
    const saved = await exerciseRepository().save(
      exerciseRepository().create({
        weight: req.body.weight,
        reps: req.body.reps,
        performedAt: new Date(req.body.performedAt),
        user,
        exerciseCatalog: catalog,
      }),
    );

    const withCatalog = await loadExerciseWithCatalog(saved.id);
    res.status(201).json(withCatalog);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ message });
  }
});

router.get("/:id", getExercise, (_req, res) => {
  res.json(res.locals["exercise"]);
});

router.patch(
  "/:id",
  validateBody(editSetSchema),
  getExercise,
  async (req, res) => {
    const exercise = res.locals["exercise"] as Exercise;

    if (req.body.weight != null) {
      exercise.weight = req.body.weight;
    }
    if (req.body.reps != null) {
      exercise.reps = req.body.reps;
    }

    try {
      const updated = await exerciseRepository().save(exercise);
      const reloaded = await loadExerciseWithCatalog(updated.id);
      res.json(reloaded);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      res.status(400).json({ message });
    }
  },
);

router.delete("/:id", getExercise, async (_req, res) => {
  try {
    const exercise = res.locals["exercise"] as Exercise;
    await exerciseRepository().remove(exercise);
    res.json({ message: "exercise deleted" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ message });
  }
});

async function getExercise(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params["id"]);

  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    return res.status(400).json({ message: "Invalid ID format provided" });
  }

  try {
    const user = res.locals["user"];

    const exercise = await exerciseRepository().findOne({
      where: { id, user: { id: user.id } },
      relations: { exerciseCatalog: true },
    });

    if (exercise == null) {
      return res.status(404).json({ message: "exercise not found" });
    }

    res.locals["exercise"] = exercise;
    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return res.status(500).json({ message });
  }
}

export default router;
