import React from 'react';
import { Button, VisuallyHidden, Image } from '@chakra-ui/react';

export const MenuButton = ({ onClick, display }) => {
  return (
    <Button
      w="12"
      px="1"
      borderRight
      borderColor="gray.200"
      color="gray.500"
      onClick={onClick}
      display={display}>
      <VisuallyHidden>Open sidebar</VisuallyHidden>
      <Image
        as="svg"
        h="6"
        w="6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h7"></path>
      </Image>
    </Button>
  );
};
