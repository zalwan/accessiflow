import { Router } from "express";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getTaskById,
} from "../models/task";

const router = Router();

// GET all tasks
router.get("/", (req, res) => {
  try {
    const tasks = getTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// GET single task
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// POST new task
router.post("/", (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Valid title is required" });
    }

    const newTask = addTask(title, description, dueDate);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT update task
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const updates = req.body;
    const updatedTask = updateTask(id, updates);

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE task
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const success = deleteTask(id);
    if (!success) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
