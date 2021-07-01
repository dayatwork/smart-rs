import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon, Box } from '@chakra-ui/react';

export const NavLink = ({ children, icon, to, isPrimaryMenu, isMobile }) => {
  const { pathname } = useLocation();

  return (
    <Link to={to}>
      <Box
        bgColor={pathname === to ? 'secondary.dark' : 'white'}
        _hover={{ bgColor: 'secondary.darker', color: 'gray.100' }}
        color={pathname === to ? 'gray.100' : 'secondary.dark'}
        display="flex"
        alignItems="center"
        px={{ base: '3', '2xl': '4' }}
        py="3"
        fontSize={{ base: 'md', '2xl': 'md' }}
        fontWeight="medium"
        rounded="md"
        mb="2.5"
        shadow="md"
      >
        <Icon
          as={icon}
          w="6"
          h="6"
          mr={isPrimaryMenu || isMobile ? '3' : null}
        />
        <Box as="span">{children}</Box>
      </Box>
    </Link>
  );
};
