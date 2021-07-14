import React from 'react';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { useCountUp } from 'use-count-up';

export const SimpleStat = ({
  label,
  total,
  isCounting,
  icon,
  mode,
  ...rest
}) => {
  const { value } = useCountUp({
    isCounting: isCounting,
    end: Number(total),
    duration: 0.5,
  });

  if (mode === 'stack') {
    return (
      <Flex
        direction="column"
        align="center"
        py="4"
        px="8"
        bg="white"
        boxShadow="md"
        rounded="md"
        maxW="full"
        {...rest}
      >
        <Text fontSize="2xl" fontWeight="semibold" color="gray.600">
          {label}
        </Text>
        <Icon mt="2" as={icon} w="14" h="14" color="green.600" />
        <Text fontSize="5xl" fontWeight="bold">
          {value}
        </Text>
      </Flex>
    );
  }

  return (
    <Box py="4" px="8" bg="white" boxShadow="md" rounded="md" {...rest}>
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="xl" fontWeight="semibold" color="gray.600">
            {label}
          </Text>
          <Text mt="-2" fontSize="4xl" fontWeight="bold">
            {value}
          </Text>
        </Box>
        <Icon as={icon} w="12" h="12" color="green.600" />
      </Flex>
    </Box>
  );
};
