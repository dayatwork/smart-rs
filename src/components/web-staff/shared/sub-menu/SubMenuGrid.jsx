import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, SimpleGrid, Center } from '@chakra-ui/react';

export const SubMenuGrid = ({ subMenus, title }) => {
  return (
    <Box pt={{ base: '4', '2xl': '0' }}>
      <Heading mb="6">{title}</Heading>
      <SimpleGrid
        columns={{ base: 1, md: 2, xl: 3, '2xl': 4 }}
        gap={{ base: '4', md: '8' }}
      >
        {subMenus.map(subMenu => (
          <Center
            key={subMenu.to}
            as={Link}
            to={subMenu.to}
            border="2px"
            borderColor="purple.600"
            py="10"
            fontSize="xl"
            fontWeight="bold"
            color="purple.600"
            rounded="md"
            _hover={{ bgColor: 'purple.100' }}
          >
            {subMenu.text}
          </Center>
        ))}
      </SimpleGrid>
    </Box>
  );
};
