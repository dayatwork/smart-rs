import React, { useContext } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  useBoolean,
  useBreakpointValue,
} from '@chakra-ui/react';
import { HiHome, HiOutlineMenu, HiX } from 'react-icons/hi';
import { RiStethoscopeFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import { Logo, NavItem, Notification, ProfileDropdown } from '../shared';
import { AuthContext } from '../../../contexts/authContext';

const useMobileMenuState = () => {
  const [isMenuOpen, actions] = useBoolean();
  /**
   * Scenario: Menu is open on mobile, and user resizes to desktop/tablet viewport.
   * Result: We'll close the menu
   */
  const isMobileBreakpoint = useBreakpointValue({ base: true, lg: false });

  React.useEffect(() => {
    if (isMobileBreakpoint === false) {
      actions.off();
    }
  }, [isMobileBreakpoint, actions]);

  return { isMenuOpen, ...actions };
};

export const WebPatientNav = ({ active }) => {
  const { employeeDetail, user } = useContext(AuthContext);
  const { isMenuOpen, toggle } = useMobileMenuState();

  return (
    <Flex align="center" bg="blue.600" color="white" px="6" h="16">
      <Flex justify="space-between" align="center" w="7xl" mx="auto">
        {/* Mobile Hamburger Menu */}
        <Box ms="-4" minW={{ base: '12', lg: '76px' }} display={{ lg: 'none' }}>
          <Box as="button" onClick={toggle} p="2" fontSize="xl">
            <Box aria-hidden as={isMenuOpen ? HiX : HiOutlineMenu} />
            <Box srOnly>{isMenuOpen ? 'Close menu' : 'Open menu'}</Box>
          </Box>
        </Box>

        {/* Mobile Navigation Menu  */}
        <Flex
          hidden={!isMenuOpen}
          as="nav"
          direction="column"
          bg="blue.600"
          position="fixed"
          height="calc(100vh - 4rem)"
          top="16"
          insetX="0"
          zIndex={10}
          w="full"
        >
          <Box px="4">
            <NavItem.Mobile
              active={active === 'home'}
              label="Home"
              href="/"
              mb="1"
            />
            <NavItem.Mobile
              active={active === 'doctor'}
              label="Doctor"
              href="/doctor"
              mb="1"
            />
            {/* <NavItem.Mobile
              active={active === "history"}
              label="History"
              href="/history-layanan"
            /> */}
            <NavItem.Mobile
              label="Dashboard Staff"
              textAlign="center"
              bg="white"
              color="purple.500"
              href="/dashboard"
            />
          </Box>
        </Flex>

        {/* Desktop Logo placement */}
        <Logo
          display={{ base: 'none', lg: 'block' }}
          flexShrink={0}
          h="10"
          w="10"
          marginEnd="10"
        />

        {/* Desktop Navigation Menu */}
        <HStack spacing="3" flex="1" display={{ base: 'none', lg: 'flex' }}>
          <NavItem.Desktop
            active={active === 'home'}
            icon={<HiHome />}
            label="Home"
            href="/"
          />
          <NavItem.Desktop
            active={active === 'doctor'}
            icon={<RiStethoscopeFill />}
            label="Doctor"
            href="/doctor"
          />
          {/* <NavItem.Desktop
            active={active === "history"}
            icon={<RiHistoryFill />}
            label="History"
            href="/history-layanan"
          /> */}
          {/* <NavItem.Desktop icon={<HiTemplate />} label="Sites" />
            <NavItem.Desktop icon={<HiRefresh />} label="Automation" /> */}
        </HStack>

        {/* Mobile Logo placement */}
        <Logo
          flex={{ base: '1', lg: '0' }}
          display={{ lg: 'none' }}
          flexShrink={0}
          h="10"
          w="10"
        />

        <HStack spacing="3">
          {(employeeDetail?.employee_id ||
            user?.role?.alias === 'super-admin') && (
            <Button
              display={{ base: 'none', lg: 'inline-flex' }}
              as={Link}
              to="/dashboard"
              bg="white"
              color="purple.500"
              size="sm"
            >
              Dashboard Staff
            </Button>
          )}
          <Notification display={{ base: 'none', lg: 'inline-flex' }} />
          <ProfileDropdown />
        </HStack>
      </Flex>
    </Flex>
  );
};
