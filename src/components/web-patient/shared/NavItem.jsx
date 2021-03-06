import { Box, HStack } from '@chakra-ui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';

const DesktopNavItem = props => {
  const { icon, label, href = '#', active } = props;
  return (
    <HStack
      as={Link}
      to={href}
      aria-current={active ? 'page' : undefined}
      spacing="2"
      px="3"
      py="2"
      rounded="md"
      transition="all 0.2s"
      color="secondary.darker"
      _hover={{ bg: 'gray.200' }}
      // color="gray.200"
      // _hover={{ bg: 'whiteAlpha.200' }}
      _activeLink={{ bg: 'secondary.dark', color: 'white' }}
    >
      {icon && (
        <Box aria-hidden fontSize="md">
          {icon}
        </Box>
      )}
      <Box fontWeight="semibold">{label}</Box>
    </HStack>
  );
};

const MobileNavItem = props => {
  const { label, href = '#', active, ...otherProps } = props;
  return (
    <Box
      as={Link}
      display="block"
      to={href}
      px="3"
      py="3"
      rounded="md"
      fontWeight="semibold"
      aria-current={active ? 'page' : undefined}
      _hover={{ bg: 'whiteAlpha.200' }}
      _activeLink={{ bg: 'blackAlpha.300', color: 'white' }}
      {...otherProps}
    >
      {label}
    </Box>
  );
};

export const NavItem = {
  Desktop: DesktopNavItem,
  Mobile: MobileNavItem,
};
