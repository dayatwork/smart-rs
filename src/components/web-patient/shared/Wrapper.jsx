import { Box } from '@chakra-ui/react';
import React from 'react';

export const Wrapper = ({ children, ...rest }) => {
  return (
    <Box
      w="full"
      py={{ base: '4', md: '6', lg: '8' }}
      px={{ base: '4', lg: '6', '2xl': '0' }}>
      <Box maxW="7xl" mx="auto" {...rest}>
        {children}
      </Box>
    </Box>
  );
};
