import React from 'react';
import { Link } from 'react-router-dom';
import { Link as ChakraLink, Box } from '@chakra-ui/react';
import { BsCaretLeftFill } from 'react-icons/bs';

export const BackButton = ({ to, text }) => {
  return (
    <ChakraLink
      as={Link}
      to={to}
      display="inline-flex"
      alignItems="center"
      color="purple.600"
      fontSize="sm"
      fontWeight="semibold"
      mb={{ base: '3', '2xl': '4' }}
      rounded="lg"
      pl={{ base: '1', '2xl': '2' }}
      pr="2"
      py="1"
      _hover={{ bg: 'purple.100' }}
    >
      <Box as={BsCaretLeftFill} fontSize="xs" marginEnd="1" />
      {text}
    </ChakraLink>
  );
};
