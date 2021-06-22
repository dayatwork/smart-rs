import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon, Box } from '@chakra-ui/react';

export const NavLink = ({ children, icon, to, isPrimaryMenu, isMobile }) => {
  const { pathname } = useLocation();

  const match = (to, pathname) => {
    if (pathname === '/dashboard') {
      if (to === '/dashboard') {
        return true;
      }
    } else if (to !== '/dashboard' && to !== '/' && pathname.startsWith(to)) {
      return true;
    }
    return false;
  };

  return (
    <Link to={to}>
      <Box
        // bgColor={match(to, pathname) ? 'gray.300' : 'gray.100'}
        bgColor={match(to, pathname) ? 'purple.600' : 'gray.100'}
        _hover={{ bgColor: 'white', color: 'purple.600' }}
        // color={match(to, pathname) ? 'gray.900' : 'gray.800'}
        color={match(to, pathname) ? 'gray.100' : 'gray.800'}
        display="flex"
        alignItems="center"
        px={{ base: '3', '2xl': '4' }}
        py={{ base: '2', '2xl': '3' }}
        fontSize={{ base: 'md', '2xl': 'md' }}
        fontWeight="medium"
        rounded="md"
        // mb={isMobile ? '2' : '0'}
        mb={isMobile ? '2' : '2'}
      >
        <Icon
          as={icon}
          // w={{ base: '6', '2xl': '7' }}
          // h={{ base: '6', '2xl': '7' }}
          w="6"
          h="6"
          mr={isPrimaryMenu || isMobile ? '3' : '0'}
        />
        <Box as="span">{children}</Box>
      </Box>
    </Link>
  );
};
