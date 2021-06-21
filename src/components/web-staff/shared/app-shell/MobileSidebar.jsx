import React from 'react';
import { Drawer, Box, DrawerOverlay, DrawerContent } from '@chakra-ui/react';

import { Logo } from './Logo';
import { CloseButton } from './CloseButton';
import { NavLink } from './NavLink';
import { menus } from './menus';

export const MobileSidebar = ({ isOpen, onClose }) => {
  return (
    <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <Box
            display="flex"
            position="fixed"
            top="0"
            right="0"
            bottom="0"
            left="0"
            style={{ zIndex: 40 }}>
            {/* <Overlay /> */}
            <Box
              position="relative"
              display="flex"
              flexDir="column"
              maxW="xs"
              w="full"
              pb="4"
              bgColor="gray.100"
              style={{ flex: '1 1 0%' }}>
              {/* Close button */}
              <Box position="absolute" top="0" right="0" mr="-12" pt="2">
                <CloseButton onClick={onClose} />
              </Box>
              {/* Closeable Sidebar */}
              <Logo />
              <Box mt="5" h="0" overflowY="auto" style={{ flex: '1 1 0%' }}>
                <Box as="nav" px="4">
                  {menus.map((menu) => (
                    <NavLink key={menu.to} isMobile icon={menu.icon} to={menu.to}>
                      {menu.text}
                    </NavLink>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};