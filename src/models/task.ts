interface Task {
  id: number;
  title: string;
  completed: boolean;
  description?: string;
  dueDate?: string;
}

let tasks: Task[] = [
  { id: 1, title: "Learn TypeScript", completed: false },
  { id: 2, title: "Build Express app", completed: false },
];

let currentId = 2;

export const getTasks = (): Task[] => [...tasks];

export const addTask = (
  title: string,
  description?: string,
  dueDate?: string
): Task => {
  if (!title) throw new Error("Title is required");

  const newTask: Task = {
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

export const updateTask = (id: number, updates: Partial<Task>): Task | null => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) return null;

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

export const deleteTask = (id: number): boolean => {
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  return tasks.length !== initialLength;
};

export const getTaskById = (id: number): Task | null => {
  return tasks.find((task) => task.id === id) || null;
};
