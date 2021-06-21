import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heading, VStack, Box } from '@chakra-ui/react';

export const SubMenuSideBar = ({ subMenus, title, titleLink }) => {
  const { pathname } = useLocation();

  // const display = subMenus.map((subMenu) => subMenu.to).includes(pathname);
  const display = subMenus.find((subMenu) => pathname.startsWith(subMenu.to));

  return (
    <Box
      // w="40"
      display={{ base: 'none', lg: display ? 'block' : 'none' }}
      h="full"
      overflow="auto"
      pb="20">
      <Link to={titleLink}>
        <Heading
          fontSize="2xl"
          py={{ base: '2', '2xl': '3' }}
          px={{ base: '3', '2xl': '6' }}>
          {title}
        </Heading>
      </Link>
      <VStack alignItems="stretch">
        {subMenus.map((subMenu) => (
          <Link to={subMenu.to} key={subMenu.to}>
            <Box
              _hover={{ bgColor: 'purple.800', color: 'purple.50' }}
              color={pathname.includes(subMenu.to) ? 'purple.600' : ''}
              fontWeight={pathname.includes(subMenu.to) ? 'bold' : 'medium'}
              display="flex"
              alignItems="center"
              py={{ base: '2', '2xl': '3' }}
              px={{ base: '4', '2xl': '6' }}
              fontSize="md">
              <Box as="span">{subMenu.text}</Box>
            </Box>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};
