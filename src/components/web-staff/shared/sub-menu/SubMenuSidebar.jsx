import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heading, VStack, Box } from '@chakra-ui/react';

export const SubMenuSideBar = ({ subMenus, title, titleLink }) => {
  const { pathname } = useLocation();

  // const display = subMenus.map((subMenu) => subMenu.to).includes(pathname);
  const display = subMenus.find(subMenu => pathname.startsWith(subMenu.to));

  return (
    <Box
      minW={{ base: '48', '2xl': '64' }}
      display={{ base: 'none', lg: display ? 'block' : 'none' }}
      h="full"
      overflow="auto"
      pt={{ base: '2', '2xl': 0 }}
      pb={{ base: '14', '2xl': '20' }}
      px={{ base: '1', '2xl': 0 }}
      bg="white"
    >
      <Link to={titleLink}>
        <Heading
          fontSize={{ base: 'lg', '2xl': '2xl' }}
          py={{ base: '2', '2xl': '3' }}
          px={{ base: '3', '2xl': '6' }}
          maxW="52"
        >
          {title}
        </Heading>
      </Link>
      <VStack alignItems="stretch">
        {subMenus.map(subMenu => (
          <Link to={subMenu.to} key={subMenu.to}>
            <Box
              _hover={{ bgColor: 'purple.800', color: 'purple.50' }}
              color={pathname.includes(subMenu.to) ? 'purple.600' : ''}
              fontWeight={pathname.includes(subMenu.to) ? 'bold' : 'medium'}
              display="flex"
              alignItems="center"
              py={{ base: '2', '2xl': '3' }}
              px={{ base: '4', '2xl': '6' }}
              fontSize="md"
            >
              <Box as="span">{subMenu.text}</Box>
            </Box>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};
