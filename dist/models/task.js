"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskById = exports.deleteTask = exports.updateTask = exports.addTask = exports.getTasks = void 0;
let tasks = [
    { id: 1, title: "Learn TypeScript", completed: false },
    { id: 2, title: "Build Express app", completed: false },
];
let currentId = 2;
const getTasks = () => [...tasks];
exports.getTasks = getTasks;
const addTask = (title, description, dueDate) => {
    if (!title)
        throw new Error("Title is required");
    const newTask = {
        id: ++currentId,
        title,
        completed: false,
        description,
        dueDate: dueDate
            ? new Date(dueDate).toISOString().split("T")[0]
            : undefined,
    };
    tasks.push(newTask);
    return newTask;
};
exports.addTask = addTask;
const updateTask = (id, updates) => {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1)
        return null;
    // Ensure completed status is boolean
    if (typeof updates.completed !== "undefined") {
        updates.completed = Boolean(updates.completed);
    }
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        id, // Prevent ID modification
    };
    return tasks[taskIndex];
};
exports.updateTask = updateTask;
const deleteTask = (id) => {
    const initialLength = tasks.length;
    tasks = tasks.filter((task) => task.id !== id);
    return tasks.length !== initialLength;
};
exports.deleteTask = deleteTask;
const getTaskById = (id) => {
    return tasks.find((task) => task.id === id) || null;
};
exports.getTaskById = getTaskById;
