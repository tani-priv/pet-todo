"use client";

import {
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import type { Todo } from "@/app/page";

type TodoListProps = {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  onAddTodo: (text: string) => void;
  onDeleteTodo: (id: number) => void;
};

export default function TodoList({
  todos,
  onToggleTodo,
  onAddTodo,
  onDeleteTodo,
}: TodoListProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    onAddTodo(input);
    setInput("");
  };

  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
    >
      <Heading size="md" mb={4} color="gray.800">
        Todoリスト
      </Heading>

      <HStack mb={4} align="stretch">
        <Input
          placeholder="やることを入力"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          bg="white"
          color="black"
          borderColor="gray.300"
          _placeholder={{ color: "gray.500" }}
        />
        <Button
          onClick={handleAdd}
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.600" }}
        >
          追加
        </Button>
      </HStack>

      <Stack gap={3}>
        {todos.map((todo) => (
          <HStack
            key={todo.id}
            justify="space-between"
            align="center"
            borderWidth="1px"
            borderRadius="md"
            p={3}
          >
            <Checkbox.Root
              checked={todo.completed}
              onCheckedChange={() => onToggleTodo(todo.id)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text
                  as={todo.completed ? "s" : "span"}
                  color={todo.completed ? "gray.500" : "black"}
                >
                  {todo.text}
                </Text>
              </Checkbox.Label>
            </Checkbox.Root>

            <Button
              size="sm"
              bg="red.500"
              color="white"
              _hover={{ bg: "red.600" }}
              onClick={() => onDeleteTodo(todo.id)}
            >
              削除
            </Button>
          </HStack>
        ))}
      </Stack>
    </Box>
  );
}