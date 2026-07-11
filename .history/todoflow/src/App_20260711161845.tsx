import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

// Тип для задачи
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Сохраняем задачи в localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Сохраняем тему
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Добавление задачи
  const addTask = () => {
    if (!input.trim()) {
      toast.error("Введите задачу!");
      return;
    }
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setInput("");
    toast.success("Задача добавлена! 🎉");
  };

  // Удаление задачи
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Задача удалена");
  };

  // Переключение статуса
  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // Очистка выполненных
  const clearCompleted = () => {
    const activeTasks = tasks.filter((task) => !task.completed);
    if (activeTasks.length === tasks.length) {
      toast.error("Нет выполненных задач");
      return;
    }
    setTasks(activeTasks);
    toast.success("Выполненные задачи удалены");
  };

  // Фильтрация задач
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Toaster position="top-right" />

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Шапка */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            ✅ TodoFlow
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Форма добавления */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Что нужно сделать?"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:text-white transition outline-none"
          />
          <button
            onClick={addTask}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Добавить
          </button>
        </div>

        {/* Фильтры и статистика */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-2">
            {[
              { key: "all", label: "Все" },
              { key: "active", label: "Активные" },
              { key: "completed", label: "Выполненные" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === key
                    ? "bg-purple-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>📌 {stats.active} осталось</span>
            <button
              onClick={clearCompleted}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition font-medium"
            >
              Очистить выполненные
            </button>
          </div>
        </div>

        {/* Список задач */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-400 dark:text-gray-500"
              >
                <p className="text-4xl mb-4">✨</p>
                <p>Нет задач. Добавьте первую!</p>
              </motion.div>
            ) : (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    task.completed
                      ? "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 opacity-70"
                      : "bg-white dark:bg-gray-800/50 border-purple-200 dark:border-purple-700 hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition flex-shrink-0 ${
                      task.completed
                        ? "bg-purple-500 border-purple-500 text-white"
                        : "border-gray-300 dark:border-gray-500 hover:border-purple-500"
                    }`}
                  >
                    {task.completed && <CheckIcon className="h-4 w-4" />}
                  </button>
                  <span
                    className={`flex-1 text-gray-800 dark:text-white transition ${
                      task.completed
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : ""
                    }`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Футер */}
        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          {tasks.length > 0 && (
            <p>
              Всего задач: {stats.total} • Выполнено: {stats.completed}
            </p>
          )}
          <p className="mt-1">Данные сохраняются автоматически</p>
        </div>
      </div>
    </div>
  );
}

export default App;
