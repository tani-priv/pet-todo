"use client";

import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";

type SidebarProps = {
  currentView: "today" | "spaces" | "timer" | "pet";
  onChangeView: (view: "today" | "spaces" | "timer" | "pet") => void;
};

export default function Sidebar({
  currentView,
  onChangeView,
}: SidebarProps) {
  const menuItems: Array<{
    key: "today" | "spaces" | "timer" | "pet";
    label: string;
  }> = [
    { key: "today", label: "Today" },
    { key: "spaces", label: "Spaces" },
    { key: "timer", label: "Timer" },
    { key: "pet", label: "Pet" },
  ];

  return (
    <Box
      p={4}
      borderRightWidth="1px"
      minH="100vh"
      bg="gray.50"
    >
      <Heading size="md" mb={6} color="gray.800">
        TODO育成AIアプリ
      </Heading>

      <Text fontSize="sm" color="gray.500" mb={3}>
        ナビゲーション
      </Text>

      <Stack gap={2}>
        {menuItems.map((item) => {
          const isActive = currentView === item.key;

          return (
            <Button
              key={item.key}
              justifyContent="flex-start"
              variant="ghost"
              bg={isActive ? "blue.100" : "transparent"}
              color={isActive ? "blue.700" : "gray.700"}
              _hover={{
                bg: isActive ? "blue.200" : "gray.100",
              }}
              onClick={() => onChangeView(item.key)}
            >
              {item.label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}