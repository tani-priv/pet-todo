"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  Progress,
} from "@chakra-ui/react";

type PetProps = {
  hunger: number;
};

export default function Pet({ hunger }: PetProps) {
  const getPetMessage = () => {
    if (hunger >= 80) return "おなかいっぱい！元気いっぱい！";
    if (hunger >= 50) return "いい感じに満たされてるよ。";
    if (hunger >= 20) return "ちょっとおなかが空いてきた…";
    return "おなかぺこぺこだよ…";
  };

  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
    >
      <VStack align="stretch" gap={4}>
        <Heading size="md">ペット</Heading>

        <Text fontSize="6xl" textAlign="center">
          🐶
        </Text>

        <Text fontWeight="bold">
          満腹度: {hunger} / 100
        </Text>

        {/* ▼ここがv3の書き方 */}
        <Progress.Root value={hunger}>
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>

        <Text color="gray.600">{getPetMessage()}</Text>
      </VStack>
    </Box>
  );
}