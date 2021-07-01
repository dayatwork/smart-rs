import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  useToast,
  Avatar,
  useMenuButton,
  Flex,
  HStack,
  Text,
  MenuItem,
  Menu,
  MenuList,
} from '@chakra-ui/react';
import { AuthContext } from '../../../../contexts/authContext';

const UserAvatar = ({ src, name }) => (
  <Avatar
    size="sm"
    src={
      src ||
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
    name={name || 'Manny Brooke'}
  />
);

const ProfileMenuButton = props => {
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
      <UserAvatar />
    </Flex>
  );
};

export const ProfileDropdown = () => {
  const toast = useToast();
  const history = useHistory();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout(() => {
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
      <ProfileMenuButton />
      <MenuList rounded="md" shadow="lg" py="1" color="gray.600" fontSize="sm">
        <HStack px="3" py="4">
          <UserAvatar />
          <Box lineHeight="1">
            <Text fontWeight="semibold">{user?.name}</Text>
            <Text mt="1" fontSize="xs" color="gray.500">
              {user?.email}
            </Text>
          </Box>
        </HStack>
        <MenuItem fontWeight="medium" as={Link} to="/account-setting">
          Account Setting
        </MenuItem>
        <MenuItem
          fontWeight="medium"
          color="red.500"
          as="button"
          onClick={handleLogout}
        >
          Sign out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
