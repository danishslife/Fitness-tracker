"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exercise_1 = require("../models/exercise");
const router = express_1.default.Router();
//Getting all
router.get("/", async (req, res) => {
    try {
        const sortField = req.query["sort"] || "name";
        const sortOrder = parseInt(req.query["sortOrder"] || "1");
        const page = Number(req.query["page"]) || 1;
        const pageLimit = Number(req.query["pageLimit"]) || 10;
        const skip = (page - 1) * pageLimit;
        const filter = {};
        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: "i" };
        }
        const exercises = await exercise_1.Exercise.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(pageLimit);
        const count = await exercise_1.Exercise.countDocuments(filter);
        res.json({ count, exercises });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(500).json({ message });
    }
});
//Getting One
router.get("/:id", getexercise, (req, res) => {
    res.json(res.locals["exercise"]);
});
//Creating One
router.post("/", async (req, res) => {
    const exercise = new exercise_1.Exercise({
        name: req.body.name,
    });
    try {
        const newexercise = await exercise.save();
        res.status(201).json(newexercise);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(400).json({ message });
    }
});
//Upating One
router.patch("/:id", getexercise, async (req, res) => {
    if (req.body.name != null) {
        res.locals["exercise"].name = req.body.name;
    }
    try {
        const updatedexercise = await res.locals["exercise"].save();
        res.json(updatedexercise);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(400).json({ message });
    }
});
//Deleting One
router.delete("/:id", getexercise, async (req, res) => {
    try {
        await res.locals["exercise"].deleteOne();
        res.json({ message: "exercise deleted" });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(500).json({ message });
    }
});
async function getexercise(req, res, next) {
    let exercise;
    try {
        exercise = await exercise_1.Exercise.findById(req.params.id);
        if (exercise == null) {
            return res.status(404).json({ message: "exercise not found" });
        }
    }
    catch (error) {
        if (error instanceof Error && error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID format provided" });
        }
        const message = error instanceof Error ? error.message : "An error occurred";
        return res.status(500).json({ message });
    }
    res.locals["exercise"] = exercise;
    next();
}
exports.default = router;
//# sourceMappingURL=exercise.js.map