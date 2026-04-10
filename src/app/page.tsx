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

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  userId: string;
};

const initialTodos: Todo[] = [
  { id: 1, text: "朝ごはんを食べる", completed: false, userId: "demo-user" },
  { id: 2, text: "メールを確認する", completed: false, userId: "demo-user" },
  { id: 3, text: "10分だけ片付けする", completed: false, userId: "demo-user" },
];

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [inputName, setInputName] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hunger, setHunger] = useState(40);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<"today" | "spaces" | "timer" | "pet">("today");

  const handleLogin = () => {
    if (!inputName.trim()) return;

    const id = inputName.trim();
    setUserId(id);
    localStorage.setItem("userId", id);

    const savedTodos = localStorage.getItem("todos");
    if (!savedTodos) {
      const demoTodos = initialTodos.map((todo) => ({
        ...todo,
        userId: id,
      }));
      setTodos(demoTodos);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("userId");
    const savedTodos = localStorage.getItem("todos");
    const savedHunger = localStorage.getItem("hunger");

    if (savedUser) {
      setUserId(savedUser);
    }

    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch {
        setTodos([]);
      }
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
    if (!text.trim() || !userId) return;

    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      userId,
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