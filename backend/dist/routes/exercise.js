"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const data_source_1 = require("../data-source");
const Exercise_1 = require("../entities/Exercise");
const requireAuth_1 = require("../middlewares/requireAuth");
const router = express_1.default.Router();
router.use(requireAuth_1.requireAuth);
const sortableFields = [
    "id",
    "name",
    "targetMuscleGroup",
    "createdAt",
    "updatedAt",
];
router.get("/", async (req, res) => {
    const user = res.locals["user"];
    try {
        const requestedField = req.query["sort"] || "name";
        const sortField = sortableFields.includes(requestedField)
            ? requestedField
            : "name";
        const sortOrder = parseInt(req.query["sortOrder"] || "1");
        const direction = sortOrder === -1 ? "DESC" : "ASC";
        const order = {
            [sortField]: direction,
        };
        const exercises = await data_source_1.AppDataSource.getRepository(Exercise_1.Exercise).find({
            where: [{ user: (0, typeorm_1.IsNull)() }, { user: { id: user.id } }],
            order,
        });
        res.status(200).json({ exercises });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown server error";
        res.status(500).json({ message });
    }
});
router.post("/", async (req, res) => {
    const user = res.locals["user"];
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const targetMuscleGroup = typeof req.body.targetMuscleGroup === "string"
        ? req.body.targetMuscleGroup.trim()
        : "";
    if (!name || !targetMuscleGroup) {
        res.status(400).json({
            message: "The 'name' and 'targetMuscleGroup' fields are required and cannot be empty.",
        });
        return;
    }
    try {
        const exerciseRepository = data_source_1.AppDataSource.getRepository(Exercise_1.Exercise);
        const newExercise = await exerciseRepository.save(exerciseRepository.create({
            name,
            targetMuscleGroup,
            user,
        }));
        res.status(201).json(newExercise);
    }
    catch (error) {
        if (error instanceof typeorm_1.QueryFailedError &&
            error.driverError.code === "23505") {
            res
                .status(409)
                .json({ message: `An exercise named '${name}' already exists.` });
            return;
        }
        const message = error instanceof Error ? error.message : "Unknown server error";
        res.status(500).json({ message });
    }
});
exports.default = router;
//# sourceMappingURL=exercise.js.map