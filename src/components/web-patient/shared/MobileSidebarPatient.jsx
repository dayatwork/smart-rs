import React, { useContext } from 'react';
import { Drawer, Box, DrawerOverlay, DrawerContent } from '@chakra-ui/react';
import { HiHome } from 'react-icons/hi';
import {
  RiStethoscopeFill,
  RiDashboardFill,
  RiHistoryFill,
} from 'react-icons/ri';

import { Logo } from './Logo';
import { CloseButton } from './CloseButton';
import { NavLink } from './NavLink';
import { AuthContext } from '../../../contexts/authContext';

export const menus = [
  {
    to: '/',
    text: 'Home',
    icon: HiHome,
  },
  {
    to: '/doctor',
    text: 'Riwayat Transaksi',
    icon: RiHistoryFill,
  },
  {
    to: '/examination',
    text: 'Riwayat Pelayanan',
    icon: RiStethoscopeFill,
  },
];

export const MobileSidebarPatient = ({ isOpen, onClose }) => {
  const { employeeDetail, user } = useContext(AuthContext);

  return (
    <Drawer placement="left" isOpen={isOpen} onClose={onClose} size="xs">
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
              // maxW="xs"
              w="full"
              pb="4"
              bgColor="secondary.lighter"
              style={{ flex: '1 1 0%' }}
            >
              {/* Close button */}
              <Box position="absolute" top="0" right="0" mr="-12" pt="2">
                <CloseButton onClick={onClose} />
              </Box>
              {/* Closeable Sidebar */}
              <Logo px="4" py="4" mobile />
              <Box mt="2" h="0" overflowY="auto" style={{ flex: '1 1 0%' }}>
                <Box as="nav" px="4">
                  {menus.map(menu => (
                    <NavLink
                      key={menu.to}
                      isMobile
                      icon={menu.icon}
                      to={menu.to}
                    >
                      {menu.text}
                    </NavLink>
                  ))}
                  {(employeeDetail?.employee_id ||
                    user?.role?.alias === 'super-admin') && (
                    <NavLink isMobile icon={RiDashboardFill} to="/dashboard">
                      Dashboard Staff
                    </NavLink>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
