import React from 'react';
import { Button, VisuallyHidden, Image } from '@chakra-ui/react';

export const CloseButton = ({ onClick }) => {
  return (
    <Button
      ml="1"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p="2.5"
      h="10"
      w="10"
      rounded="full"
      onClick={onClick}>
      <VisuallyHidden>Close sidebar</VisuallyHidden>
      <Image
        as="svg"
        h="10"
        w="10"
        color="gray.500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"></path>
      </Image>
    </Button>
  );
};
