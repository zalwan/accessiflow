"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_1 = require("../models/task");
const router = (0, express_1.Router)();
// GET all tasks
router.get("/", (req, res) => {
    try {
        const tasks = (0, task_1.getTasks)();
        res.json(tasks);
    }
    catch (error) {
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
        const task = (0, task_1.getTaskById)(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    }
    catch (error) {
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
        const newTask = (0, task_1.addTask)(title, description, dueDate);
        res.status(201).json(newTask);
    }
    catch (error) {
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
        const updatedTask = (0, task_1.updateTask)(id, updates);
        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(updatedTask);
    }
    catch (error) {
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
        const success = (0, task_1.deleteTask)(id);
        if (!success) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});
exports.default = router;
