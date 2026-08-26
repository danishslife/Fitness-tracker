"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const exercise_1 = __importDefault(require("./routes/exercise"));
const exerciseCatalog_1 = __importDefault(require("./routes/exerciseCatalog"));
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
}
mongoose_1.default.connect(databaseUrl);
const db = mongoose_1.default.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/exercise", exercise_1.default);
app.use("/api/exerciseCatalog", exerciseCatalog_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
//# sourceMappingURL=index.js.map