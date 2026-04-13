"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import Pet from "@/components/Pet";
import TodoList from "@/components/TodoList";
import Sidebar from "@/components/Sidebar";
import type { Todo } from "@/types/todo";
import { loadUser, saveUser } from "@/lib/storage/userStorage";
import { loadHunger, saveHunger } from "@/lib/storage/hungerStorage";
import { supabase } from "@/lib/supabase/client";

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [inputName, setInputName] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hunger, setHunger] = useState(40);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<"today" | "spaces" | "timer" | "pet">("today");

  const fetchTodos = async (targetUserId: string) => {
    const { data, error } = await supabase
      .from("todos")
      .select("id, text, completed, user_id, created_at")
      .eq("user_id", targetUserId)
      .order("id", { ascending: false });

    if (error) {
      console.error("Failed to fetch todos:", error);
      return;
    }

    const mappedTodos: Todo[] = (data ?? []).map((todo) => ({
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      userId: todo.user_id,
      created_at: todo.created_at,
    }));

    setTodos(mappedTodos);
  };

  const handleLogin = async () => {
    if (!inputName.trim()) return;

    const id = inputName.trim();
    setUserId(id);
    saveUser(id);

    await fetchTodos(id);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const savedUser = loadUser();
        const savedHunger = loadHunger();

        if (savedUser) {
          setUserId(savedUser);
          await fetchTodos(savedUser);
        }

        if (savedHunger !== null) {
          setHunger(savedHunger);
        }
      } catch (error) {
        console.error("Failed to initialize page", error);
      } finally {
        setIsLoaded(true);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveHunger(hunger);
  }, [hunger, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !userId) return;
    saveUser(userId);
  }, [userId, isLoaded]);

  const handleAddTodo = async (text: string) => {
    if (!text.trim() || !userId) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          text: text.trim(),
          completed: false,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Failed to add todo:", error);
      return;
    }

    const newTodo: Todo = {
      id: data.id,
      text: data.text,
      completed: data.completed,
      userId: data.user_id,
      created_at: data.created_at,
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

 const handleToggleTodo = async (id: number) => {
  const targetTodo = todos.find((todo) => todo.id === id);
  if (!targetTodo) return;

  const nextCompleted = !targetTodo.completed;

  const { error } = await supabase
    .from("todos")
    .update({ completed: nextCompleted })
    .eq("id", id);

  if (error) {
    console.error("Failed to toggle todo:", error);
    return;
  }

  setTodos((prevTodos) =>
    prevTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: nextCompleted } : todo
    )
  );

  if (!targetTodo.completed) {
    setHunger((prev) => Math.min(prev + 20, 100));
  }
};

  const handleDeleteTodo = async (id: number) => {
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete todo:", error);
    return;
  }

  setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
};

  if (!isLoaded) {
    return (
      <Container py={10}>
        <Text>読み込み中...</Text>
      </Container>
    );
  }

  if (!userId) {
    return (
      <Container py={10}>
        <VStack gap={4}>
          <Heading>ログイン（仮）</Heading>

          <Input
            placeholder="ユーザー名"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            bg="white"
            color="black"
            borderColor="gray.300"
            _placeholder={{ color: "gray.500" }}
          />

          <Button onClick={handleLogin} colorScheme="blue">
            開始
          </Button>
        </VStack>
      </Container>
    );
  }

  const userTodos = todos.filter((todo) => todo.userId === userId);

  return (
    <SimpleGrid columns={{ base: 1, md: 5 }} minH="100vh" gap={0}>
      <Box gridColumn={{ base: "span 1", md: "span 1" }}>
        <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      </Box>

      <Box gridColumn={{ base: "span 1", md: "span 4" }} bg="gray.100">
        <Container maxW="container.xl" py={8}>
          <Heading mb={2}>ようこそ {userId}</Heading>
          <Text mb={6} color="gray.600">
            現在の画面: {currentView}
          </Text>

          {currentView === "today" && (
            <SimpleGrid columns={{ base: 1, xl: 2 }} gap={6}>
              <Box>
                <TodoList
                  todos={userTodos}
                  onToggleTodo={handleToggleTodo}
                  onAddTodo={handleAddTodo}
                  onDeleteTodo={handleDeleteTodo}
                />
              </Box>

              <Box>
                <Pet hunger={hunger} />
              </Box>
            </SimpleGrid>
          )}

          {currentView === "spaces" && (
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
              bg="white"
            >
              <Heading size="md" mb={4}>
                Spaces
              </Heading>
              <Text color="gray.600">
                ここに将来、プロジェクトやカテゴリ単位のTodo管理を入れます。
              </Text>
            </Box>
          )}

          {currentView === "timer" && (
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
              bg="white"
            >
              <Heading size="md" mb={4}>
                Timer
              </Heading>
              <Text color="gray.600">
                ここに将来、ポモドーロタイマーや集中モードを入れます。
              </Text>
            </Box>
          )}

          {currentView === "pet" && (
            <Box maxW="600px">
              <Pet hunger={hunger} />
            </Box>
          )}
        </Container>
      </Box>
    </SimpleGrid>
  );
}