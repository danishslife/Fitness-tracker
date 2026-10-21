"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const typeorm_1 = require("typeorm");
const Exercise_1 = require("../entities/Exercise");
const ExerciseCatalog_1 = require("../entities/ExerciseCatalog");
const schemaValidator_1 = require("../middlewares/schemaValidator");
const requireAuth_1 = require("../middlewares/requireAuth");
const data_source_1 = require("../data-source");
const router = express_1.default.Router();
router.use(requireAuth_1.requireAuth);
const createSetSchema = zod_1.z.object({
    exerciseCatalog: zod_1.z
        .number()
        .int()
        .positive("Exercise is required"),
    weight: zod_1.z.number().positive("Weight must be greater than 0"),
    reps: zod_1.z.number().positive("Reps must be greater than 0"),
    performedAt: zod_1.z.iso.datetime(),
});
const editSetSchema = zod_1.z.object({
    weight: zod_1.z.number().positive("Weight must be greater than 0"),
    reps: zod_1.z.number().positive("Reps must be greater than 0"),
});
function exerciseRepository() {
    return data_source_1.AppDataSource.getRepository(Exercise_1.Exercise);
}
async function loadExerciseWithCatalog(id) {
    return exerciseRepository().findOne({
        where: { id },
        relations: { exerciseCatalog: true },
    });
}
router.get("/", async (req, res) => {
    try {
        const startDate = req.query["startDate"];
        const endDate = req.query["endDate"];
        if (!startDate || !endDate) {
            res.status(400).json({
                message: "The 'startDate' and 'endDate' fields are required and cannot be empty.",
            });
            return;
        }
        const user = res.locals["user"];
        const exercises = await exerciseRepository().find({
            where: {
                user: { id: user.id },
                performedAt: (0, typeorm_1.Between)(new Date(startDate), new Date(endDate)),
            },
            relations: { exerciseCatalog: true },
            order: { performedAt: "ASC", createdAt: "ASC" },
        });
        res.json({ exercises });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(500).json({ message });
    }
});
router.post("/", (0, schemaValidator_1.validateBody)(createSetSchema), async (req, res) => {
    const user = res.locals["user"];
    const catalogId = req.body.exerciseCatalog;
    const catalog = await data_source_1.AppDataSource.getRepository(ExerciseCatalog_1.ExerciseCatalog).findOneBy({ id: catalogId });
    if (!catalog) {
        res.status(400).json({ message: "Invalid exercise catalog id" });
        return;
    }
    try {
        const saved = await exerciseRepository().save(exerciseRepository().create({
            weight: req.body.weight,
            reps: req.body.reps,
            performedAt: new Date(req.body.performedAt),
            user,
            exerciseCatalog: catalog,
        }));
        const withCatalog = await loadExerciseWithCatalog(saved.id);
        res.status(201).json(withCatalog);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(400).json({ message });
    }
});
router.get("/:id", getExercise, (_req, res) => {
    res.json(res.locals["exercise"]);
});
router.patch("/:id", (0, schemaValidator_1.validateBody)(editSetSchema), getExercise, async (req, res) => {
    const exercise = res.locals["exercise"];
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(400).json({ message });
    }
});
router.delete("/:id", getExercise, async (_req, res) => {
    try {
        const exercise = res.locals["exercise"];
        await exerciseRepository().remove(exercise);
        res.json({ message: "exercise deleted" });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(500).json({ message });
    }
});
async function getExercise(req, res, next) {
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        return res.status(500).json({ message });
    }
}
exports.default = router;
//# sourceMappingURL=exercise.js.map