import React, { useContext } from 'react';
import { Box, Button, Flex, HStack, useDisclosure } from '@chakra-ui/react';
import { HiHome } from 'react-icons/hi';
import {
  RiStethoscopeFill,
  RiHistoryFill,
  RiDashboardFill,
} from 'react-icons/ri';
import { Link } from 'react-router-dom';

import { Logo, NavItem, Notification, ProfileDropdown } from '../shared';
import { AuthContext } from '../../../contexts/authContext';
import { MenuButton } from './MenuButton';
import { MobileSidebarPatient } from './MobileSidebarPatient';
import { MdQuestionAnswer } from 'react-icons/md';

export const WebPatientNav = ({ active }) => {
  const { employeeDetail, user } = useContext(AuthContext);
  const {
    isOpen: isOpenMobile,
    onOpen: onOpenMobile,
    onClose: onCloseMobile,
  } = useDisclosure();

  return (
    <>
      <MobileSidebarPatient isOpen={isOpenMobile} onClose={onCloseMobile} />
      <Flex
        align="center"
        // bg="secondary.dark"
        bg="white"
        // color="white"
        px={{ base: '4', md: '6' }}
        h="16"
        boxShadow="lg"
      >
        <Flex justify="space-between" align="center" w="7xl" mx="auto">
          <HStack spacing="3">
            <MenuButton
              onClick={onOpenMobile}
              display={{ base: 'flex', lg: 'none' }}
            />
            <Logo light display={{ base: 'none', lg: 'flex' }} />
          </HStack>
          <Logo mini display={{ base: 'flex', lg: 'none' }} />

          <HStack spacing="3" flex="1" display={{ base: 'none', lg: 'flex' }}>
            <NavItem.Desktop
              active={active === 'home'}
              icon={<HiHome />}
              label="Home"
              href="/"
            />
            <NavItem.Desktop
              active={active === 'doctor'}
              icon={<RiHistoryFill />}
              label="Riwayat Transaksi"
              href="/doctor"
            />
            <NavItem.Desktop
              active={active === 'examination'}
              icon={<RiStethoscopeFill />}
              label="Riwayat Pelayanan"
              href="/examination"
            />
            <NavItem.Desktop
              active={active === 'faq'}
              icon={<MdQuestionAnswer />}
              label="FAQ"
              href="/faq"
            />
          </HStack>

          <Box display={{ base: 'flex', lg: 'none' }} w="14" />

          <HStack spacing="3" display={{ base: 'none', lg: 'flex' }}>
            {(employeeDetail?.employee_id ||
              user?.role?.alias === 'super-admin') && (
              <Button
                display={{ base: 'none', lg: 'inline-flex' }}
                as={Link}
                to="/dashboard"
                // bg="white"
                colorScheme="primary"
                size="sm"
                variant="solid"
                leftIcon={<RiDashboardFill />}
              >
                Dashboard Staff
              </Button>
            )}
            <Notification display={{ base: 'none', lg: 'inline-flex' }} />
            <ProfileDropdown />
          </HStack>
        </Flex>
      </Flex>
    </>
  );
};
