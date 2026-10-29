"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const exercise_1 = __importDefault(require("./routes/exercise"));
const workoutSet_1 = __importDefault(require("./routes/workoutSet"));
const auth_1 = __importDefault(require("./routes/auth"));
const data_source_1 = require("./data-source");
async function main() {
    await data_source_1.AppDataSource.initialize();
    console.log("Connected to Database");
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use("/api/exercise", exercise_1.default);
    app.use("/api/workoutSet", workoutSet_1.default);
    app.use("/api/auth", auth_1.default);
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}`));
}
main().catch((error) => {
    console.error("Failed to start", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map