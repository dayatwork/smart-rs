import React from 'react';
import { Flex, Box, HStack } from '@chakra-ui/react';

import { MenuButton } from './MenuButton';
import { Notification } from './NotificationButton';
import { ProfileDropdown } from './ProfileDropdown';
import { Logo } from './Logo';

export const AppShellHeader = ({ onOpenMobile }) => {
  return (
    <Flex
      position="relative"
      style={{ zIndex: 10, flexShrink: 0 }}
      h="16"
      bgColor="purple.600"
      alignItems="center"
    >
      <Logo display={{ lg: 'block', base: 'none' }} />
      <Box
        style={{ flex: '1 1 0%' }}
        px="4"
        display="flex"
        justifyContent={{ base: 'space-between', lg: 'flex-end' }}
        alignItems="center"
      >
        <MenuButton
          onClick={onOpenMobile}
          display={{ base: 'flex', lg: 'none' }}
        />
        <Logo display={{ base: 'flex', lg: 'none' }} />
        <HStack spacing="3">
          <Notification />
          <ProfileDropdown />
        </HStack>
      </Box>
    </Flex>
  );
};
