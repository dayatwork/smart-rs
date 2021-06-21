import React from 'react';
import { Box } from '@chakra-ui/react';

export const ContentWrapper = ({ children }) => {
  return (
    <Box
      bgColor="gray.50"
      flexGrow="1"
      px={{ base: '4', lg: '10' }}
      pt="4"
      pb="24"
      h="full"
      overflow="auto">
      {children}
    </Box>
  );
};
