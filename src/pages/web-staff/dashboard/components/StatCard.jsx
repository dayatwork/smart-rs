import * as React from 'react';
import {
  // Badge,
  Box,
  Circle,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

export const StatCard = props => {
  const { accentColor, icon, data } = props;
  const {
    label,
    value,
    // , change
  } = data;

  const headingSize = useBreakpointValue({ base: 'lg', '2xl': 'xl' });

  return (
    <Stack mx="auto" spacing={{ base: '1', '2xl': '3' }}>
      <Box
        color="gray.600"
        fontWeight="medium"
        fontSize={{ base: 'lg', '2xl': 'xl' }}
      >
        {label}
      </Box>
      <HStack spacing={{ base: '2', '2xl': '3' }}>
        <Circle flexShrink={0} size="6" bg={accentColor} color="white">
          {icon}
        </Circle>
        <Heading as="h1" size={headingSize} fontWeight="bold">
          {value}{' '}
          <Text
            as="span"
            fontSize={{ base: 'md', '2xl': 'lg' }}
            fontWeight="medium"
          >
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
