import React from 'react';
import { Box } from '@chakra-ui/react';

export const ContentWrapper = ({ children }) => {
  return (
    <Box
      bgColor="gray.50"
      flexGrow="1"
      px={{ base: '4', lg: '6', '2xl': '10' }}
      pt={{ base: '2', '2xl': '4' }}
      pb={{ base: '14', '2xl': '24' }}
      h="full"
      overflow="auto"
    >
      {children}
    </Box>
  );
};
