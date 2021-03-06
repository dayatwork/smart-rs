import {
  Avatar,
  Box,
  Flex,
  HStack,
  Menu,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue as mode,
  useMenuButton,
  useToast,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../contexts/authContext';

const UserAvatar = ({ size }) => (
  <Avatar
    size={size}
    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    name="Manny Brooke"
  />
);

const ProfileMenuButton = ({ size, ...props }) => {
  const buttonProps = useMenuButton(props);
  return (
    <Flex
      {...buttonProps}
      as="button"
      flexShrink={0}
      rounded="full"
      outline="0"
      _focus={{ shadow: 'outline' }}
    >
      <Box srOnly>Open user menu</Box>
      <UserAvatar size={size} />
    </Flex>
  );
};

export const ProfileDropdown = ({ size = 'sm' }) => {
  const [, , removeCookie] = useCookies(['token']);
  const toast = useToast();
  const history = useHistory();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout(() => {
      removeCookie('token', { path: '/' });
      removeCookie('user', { path: '/' });
      removeCookie('employee', { path: '/' });
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Anda berhasil logout`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      history.push('/login');
    });
  };

  return (
    <Menu placement="bottom-end">
      <ProfileMenuButton size={size} />
      <MenuList
        rounded="md"
        shadow="lg"
        py="1"
        color={mode('gray.600', 'inherit')}
        fontSize="sm"
        zIndex="10"
      >
        <HStack px="3" py="4">
          <UserAvatar size={size} />
          <Box lineHeight="1">
            <Text fontWeight="semibold">{user?.name || 'Anonim'}</Text>
            <Text mt="1" fontSize="xs" color="gray.500">
              {user?.email || 'anonim@gmail.com'}
            </Text>
          </Box>
        </HStack>
        <MenuItem fontWeight="medium" as={Link} to="/account-setting">
          Account Setting
        </MenuItem>
        <MenuItem
          fontWeight="medium"
          color={mode('red.500', 'red.300')}
          as="button"
          onClick={handleLogout}
        >
          Sign out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
