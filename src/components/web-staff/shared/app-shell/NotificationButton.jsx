import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Center,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';

export const NotificationButton = () => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        aria-label="Notification"
        bgColor="white"
        p="1"
        rounded="full"
        color="gray.400"
        _hover={{ color: 'gray.500' }}
      />
      <MenuList>
        <MenuItem>Download</MenuItem>
        <MenuItem>Create a Copy</MenuItem>
        <MenuItem>Mark as Draft</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem>
      </MenuList>
    </Menu>
  );
};

const NotificationBadge = (props) => (
  <Center
    bg="red.500"
    fontSize="xs"
    fontWeight="bold"
    position="absolute"
    rounded="full"
    textAlign="center"
    top="-2px"
    insetEnd="0"
    w="18px"
    h="18px"
    {...props}
  />
);

export const Notification = (props) => (
  <Menu>
    <MenuButton
      as={Button}
      bg="transparent"
      _hover={{ bg: 'purple.500' }}
      _active={{ bg: 'purple.800' }}>
      <Center
        // as="button"
        outline="0"
        w="8"
        h="8"
        position="relative"
        rounded="md"
        _hover={{ bg: 'whiteAlpha.200' }}
        _focus={{ shadow: 'outline' }}
        {...props}>
        <Box srOnly>Click to see 9 notifications</Box>
        <NotificationBadge>9</NotificationBadge>
        <Box as={FaBell} fontSize="lg" fill="white" />
      </Center>
    </MenuButton>
    <MenuList>
      <Box textAlign="center" h="8" fontWeight="semibold" bg="gray.100">
        Notification{' '}
        {/* <Box as="span" p="1" bg="red.500" rounded="full" px="3">
          9
        </Box> */}
      </Box>
      <MenuItem py="3">Nofitication 1</MenuItem>
      <MenuItem py="3">Nofitication 2</MenuItem>
      <MenuItem py="3">Nofitication 3</MenuItem>
      <MenuItem py="3">Nofitication 4</MenuItem>
      <MenuItem py="3">
        <Box
          as={Link}
          to="/notification"
          color="purple.600"
          textAlign="center"
          w="full"
          variant="link">
          See All Notification
        </Box>
      </MenuItem>
    </MenuList>
  </Menu>
);
