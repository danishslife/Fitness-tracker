import express from "express";
import type { Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import type { FindOptionsOrder } from "typeorm";
import { AppDataSource } from "../data-source";
import { ExerciseCatalog } from "../entities/ExerciseCatalog";

const router = express.Router();

const sortableFields = [
  "id",
  "name",
  "targetMuscleGroup",
  "createdAt",
  "updatedAt",
];

router.get("/", async (req: Request, res: Response) => {
  try {
    const requestedField = (req.query["sort"] as string) || "name";
    const sortField = sortableFields.includes(requestedField)
      ? requestedField
      : "name";
    const sortOrder = parseInt((req.query["sortOrder"] as string) || "1");
    const direction = sortOrder === -1 ? "DESC" : "ASC";

    const order: FindOptionsOrder<ExerciseCatalog> = {
      [sortField]: direction,
    };

    const exerciseCatalog = await AppDataSource.getRepository(
      ExerciseCatalog,
    ).find({ order });

    res.status(200).json({ exerciseCatalog });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    res.status(500).json({ message });
  }
});

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
    const exerciseCatalogRepository =
      AppDataSource.getRepository(ExerciseCatalog);
    const newExerciseCatalog = await exerciseCatalogRepository.save(
      exerciseCatalogRepository.create({ name, targetMuscleGroup }),
    );
    res.status(201).json(newExerciseCatalog);
  } catch (error) {
    if (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string }).code === "23505"
    ) {
      res
        .status(409)
        .json({ message: `An exercise named '${name}' already exists.` });
      return;
    }

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    res.status(500).json({ message });
  }
});

export default router;
