import React, { useContext } from 'react';
import { Drawer, Box, DrawerOverlay, DrawerContent } from '@chakra-ui/react';
import { HiHome } from 'react-icons/hi';

import { Logo } from './Logo';
import { CloseButton } from './CloseButton';
import { NavLink } from './NavLink';
import { menus } from './menus';
import { AuthContext } from '../../../../contexts/authContext';

export const MobileSidebar = ({ isOpen, onClose }) => {
  const { permissions, user } = useContext(AuthContext);

  const showedMenus = menus
    .map(menu => {
      if (menu.permission) {
        if (permissions.includes(menu.permission)) {
          return menu;
        }
        return false;
      }
      return menu;
    })
    .filter(menu => !!menu);

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
            style={{ zIndex: 40 }}
          >
            {/* <Overlay /> */}
            <Box
              position="relative"
              display="flex"
              flexDir="column"
              maxW="xs"
              w="full"
              pb="4"
              bgColor="gray.100"
              style={{ flex: '1 1 0%' }}
            >
              {/* Close button */}
              <Box position="absolute" top="0" right="0" mr="-12" pt="2">
                <CloseButton onClick={onClose} />
              </Box>
              {/* Closeable Sidebar */}
              <Logo mobile />
              <Box mt="5" h="0" overflowY="auto" style={{ flex: '1 1 0%' }}>
                <Box as="nav" px="4">
                  {(user?.role?.alias === 'super-admin'
                    ? menus
                    : showedMenus
                  ).map(menu => (
                    <NavLink
                      key={menu.to}
                      isMobile
                      icon={menu.icon}
                      to={menu.to}
                    >
                      {menu.text}
                    </NavLink>
                  ))}
                  <NavLink isMobile icon={HiHome} to="/">
                    Web Patient
                  </NavLink>
                </Box>
              </Box>
            </Box>
          </Box>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
