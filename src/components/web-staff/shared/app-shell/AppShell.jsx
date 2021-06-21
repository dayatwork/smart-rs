import React from 'react';
import { Box, Flex, useDisclosure } from '@chakra-ui/react';

import { DesktopSidebar } from './DesktopSidebar';
import { AppShellHeader } from './AppShellHeader';
import { MobileSidebar } from './MobileSidebar';

export const AppShell = ({ children }) => {
  const {
    isOpen: isOpenMobile,
    onOpen: onOpenMobile,
    onClose: onCloseMobile,
  } = useDisclosure();

  return (
    <Box
      bgColor="gray.100"
      height="100vh"
      w="100vw"
      overflow="hidden"
      position="relative">
      <MobileSidebar isOpen={isOpenMobile} onClose={onCloseMobile} />
      <Flex h="full">
        <DesktopSidebar />
        <Box flexGrow="1" bg="white" h="full" w="full">
          <AppShellHeader onOpenMobile={onOpenMobile} />
          <Box overflow="auto" h="full" w="full">
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};
