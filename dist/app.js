"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Enhanced CORS configuration
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
// Routes
app.use("/tasks", tasks_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
