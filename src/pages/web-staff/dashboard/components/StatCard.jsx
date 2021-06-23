import * as React from 'react';
import {
  // Badge,
  Box,
  Circle,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';

export const StatCard = props => {
  const { accentColor, icon, data } = props;
  const {
    label,
    value,
    // , change
  } = data;
  // const isNegative = change < 0;
  return (
    <Stack mx="auto" spacing="3">
      <Box color="gray.600" fontWeight="medium" fontSize="xl">
        {label}
      </Box>
      <HStack spacing="3">
        <Circle flexShrink={0} size="6" bg={accentColor} color="white">
          {icon}
        </Circle>
        <Heading as="h1" size="xl" fontWeight="bold">
          {value}{' '}
          <Text as="span" fontSize="lg" fontWeight="medium">
            Pasien
          </Text>
        </Heading>
      </HStack>
      {/* <HStack>
        <Text>Past 7 days</Text>
        <Badge
          fontSize="sm"
          px="2"
          rounded="full"
          colorScheme={isNegative ? 'red' : 'green'}
        >
          {change}%
        </Badge>
      </HStack> */}
    </Stack>
  );
};
