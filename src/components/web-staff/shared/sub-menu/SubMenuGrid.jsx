import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, SimpleGrid, Center } from '@chakra-ui/react';

export const SubMenuGrid = ({ subMenus, title }) => {
  return (
    <Box pb={{ base: '10', '2xl': '0' }}>
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '3xl', '2xl': '4xl' }}
      >
        {title}
      </Heading>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
        gap={{ base: '4', lg: '5', '2xl': '8' }}
      >
        {subMenus.map(subMenu => (
          <Center
            key={subMenu.to}
            as={Link}
            to={subMenu.to}
            border="2px"
            borderColor="purple.600"
            py={{ base: '8', '2xl': '10' }}
            fontSize={{ base: 'lg', '2xl': 'xl' }}
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
