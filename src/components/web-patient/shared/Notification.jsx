import React from 'react';
// import { Link } from 'react-router-dom';
import {
  Button,
  Center,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Flex,
  Avatar,
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

const NotificationBadge = props => (
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

export const Notification = props => (
  <Menu placement="bottom-end">
    <MenuButton
      as={Button}
      bg="transparent"
      _hover={{ bg: props.light ? 'primary.500' : 'primary.100' }}
      _active={{ bg: 'primary.500', color: 'white' }}
    >
      <Center
        // as="button"
        outline="0"
        w="8"
        h="8"
        position="relative"
        rounded="md"
        _hover={{ bg: 'whiteAlpha.200' }}
        _focus={{ shadow: 'outline' }}
        {...props}
      >
        <Box srOnly>Click to see 9 notifications</Box>
        <NotificationBadge>9</NotificationBadge>
        <Box as={FaBell} fontSize="lg" fill={props.light ? 'white' : 'gray'} />
      </Center>
    </MenuButton>
    <MenuList w="sm">
      <Box px="4" py="3">
        <Text fontWeight="semibold">Notifications</Text>
        <Text color="gray.500">You have 2 unread messages</Text>
      </Box>
      <MenuItem py="3" px="4">
        <Flex>
          <Avatar src="/images/1.png" mr="5" />
          <Box mt="-1">
            <Text color="gray.500" lineHeight="5">
              <Box fontWeight="semibold" as="span" color="gray.900">
                Pembayaran anda sudah dikonfirmasi.
              </Box>{' '}
              Mohon untuk datang tepat waktu sesuai jadwal Anda.
            </Text>
          </Box>
        </Flex>
      </MenuItem>
      <MenuItem py="3" px="4">
        <Flex>
          <Avatar src="/images/1.png" mr="5" />
          <Box mt="-1">
            <Text color="gray.500" lineHeight="5">
              <Box fontWeight="semibold" as="span" color="gray.900">
                Pembayaran anda sudah dikonfirmasi.
              </Box>{' '}
              Mohon untuk datang tepat waktu sesuai jadwal Anda.
            </Text>
          </Box>
        </Flex>
      </MenuItem>
      <MenuItem py="3" px="4">
        <Flex>
          <Avatar src="/images/1.png" mr="5" />
          <Box mt="-1">
            <Text color="gray.500" lineHeight="5">
              <Box fontWeight="semibold" as="span" color="gray.900">
                Pembayaran anda sudah dikonfirmasi.
              </Box>{' '}
              Mohon untuk datang tepat waktu sesuai jadwal Anda.
            </Text>
          </Box>
        </Flex>
      </MenuItem>
      <MenuItem py="3" px="4">
        <Flex>
          <Avatar src="/images/1.png" mr="5" />
          <Box mt="-1">
            <Text color="gray.500" lineHeight="5">
              <Box fontWeight="semibold" as="span" color="gray.900">
                Pembayaran anda sudah dikonfirmasi.
              </Box>{' '}
              Mohon untuk datang tepat waktu sesuai jadwal Anda.
            </Text>
          </Box>
        </Flex>
      </MenuItem>
      <MenuItem py="3" px="4">
        <Box
          // as={Link}
          // to="/notification"
          color="primary.600"
          textAlign="center"
          w="full"
          variant="link"
        >
          See All Notification
        </Box>
      </MenuItem>
    </MenuList>
  </Menu>
);

// import {
//   Box,
//   Center,
//   Button,
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuList,
//   IconButton,
// } from '@chakra-ui/react';
// import * as React from 'react';
// import { FaBell } from 'react-icons/fa';

// const NotificationBadge = props => (
//   <Center
//     bg="red.500"
//     fontSize="xs"
//     fontWeight="bold"
//     position="absolute"
//     rounded="full"
//     textAlign="center"
//     top="-2px"
//     insetEnd="0"
//     w="18px"
//     h="18px"
//     {...props}
//   />
// );

// const NotificationButton = ({ light, ...props }) => (
//   <Center
//     as="button"
//     outline="0"
//     w="8"
//     h="8"
//     position="relative"
//     rounded="md"
//     _hover={{ bg: 'whiteAlpha.200' }}
//     _focus={{ shadow: 'outline' }}
//     {...props}
//   >
//     <Box srOnly>Click to see 9 notifications</Box>
//     <NotificationBadge>9</NotificationBadge>
//     <Box
//       as={FaBell}
//       fontSize="lg"
//       //  color={light ? 'gray.100' : 'gray.900'}
//       color="white"
//     />
//   </Center>
// );

// export const Notification = ({ light, ...props }) => (
//   <Center
//     as="button"
//     outline="0"
//     w="8"
//     h="8"
//     position="relative"
//     rounded="md"
//     _hover={{ bg: 'whiteAlpha.200' }}
//     _focus={{ shadow: 'outline' }}
//     {...props}
//   >
//     <Box srOnly>Click to see 9 notifications</Box>
//     <NotificationBadge>9</NotificationBadge>
//     <Box
//       as={FaBell}
//       fontSize="lg"
//       //  color={light ? 'gray.100' : 'gray.900'}
//       color="white"
//     />
//   </Center>
// );
