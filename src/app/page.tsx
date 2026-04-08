"use client";

import { useEffect, useState } from "react";
import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
import Pet from "@/components/Pet";
import TodoList from "@/components/TodoList";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const initialTodos: Todo[] = [
  { id: 1, text: "朝ごはんを食べる", completed: false },
  { id: 2, text: "メールを確認する", completed: false },
  { id: 3, text: "10分だけ片付けする", completed: false },
];

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hunger, setHunger] = useState(40);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    const savedHunger = localStorage.getItem("hunger");

    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch {
        setTodos(initialTodos);
      }
    } else {
      setTodos(initialTodos);
    }

    if (savedHunger) {
      setHunger(Number(savedHunger));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("hunger", hunger.toString());
  }, [hunger, isLoaded]);

  const handleAddTodo = (text: string) => {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggleTodo = (id: number) => {
    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo) return;

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    if (!targetTodo.completed) {
      setHunger((prev) => Math.min(prev + 20, 100));
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Heading mb={6}>Todo × ペット育成アプリ</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <Box>
          <TodoList
            todos={todos}
            onToggleTodo={handleToggleTodo}
            onAddTodo={handleAddTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        </Box>

        <Box>
          <Pet hunger={hunger} />
        </Box>
      </SimpleGrid>
    </Container>
  );
}