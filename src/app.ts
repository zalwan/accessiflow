import express from "express";
import cors from "cors";
import path from "path";
import taskRoutes from "./routes/tasks";

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
app.use(
  cors({
    origin: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/tasks", taskRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
