import express from "express";
import type { Request, Response } from "express";
import { QueryFailedError, IsNull } from "typeorm";
import type { FindOptionsOrder } from "typeorm";
import { AppDataSource } from "../data-source";
import { Exercise } from "../entities/Exercise";
import { requireAuth } from "../middlewares/requireAuth";
import type { User } from "../entities/User";

const router = express.Router();

router.use(requireAuth);

const sortableFields = [
  "id",
  "name",
  "targetMuscleGroup",
  "createdAt",
  "updatedAt",
];

router.get("/", async (req: Request, res: Response) => {
  const user = res.locals["user"] as User;

  try {
    const requestedField = (req.query["sort"] as string) || "name";
    const sortField = sortableFields.includes(requestedField)
      ? requestedField
      : "name";
    const sortOrder = parseInt((req.query["sortOrder"] as string) || "1");
    const direction = sortOrder === -1 ? "DESC" : "ASC";

    const order: FindOptionsOrder<Exercise> = {
      [sortField]: direction,
    };

    const exercises = await AppDataSource.getRepository(Exercise).find({
      where: [{ user: IsNull() }, { user: { id: user.id } }],
      order,
    });

    res.status(200).json({ exercises });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    res.status(500).json({ message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const user = res.locals["user"] as User;
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
    const exerciseRepository = AppDataSource.getRepository(Exercise);
    const newExercise = await exerciseRepository.save(
      exerciseRepository.create({
        name,
        targetMuscleGroup,
        user,
      }),
    );
    res.status(201).json(newExercise);
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
