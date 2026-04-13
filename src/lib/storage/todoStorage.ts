import type { Todo } from "@/types/todo";

const TODO_STORAGE_KEY = "todos";

export function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(TODO_STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Todo[];
  } catch (error) {
    console.error("Failed to load todos", error);
    return [];
  }
}

export function saveTodos(todos: Todo[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}