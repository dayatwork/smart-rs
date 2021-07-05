import React from 'react';
import { Link } from 'react-router-dom';
import {
  Center,
  Box,
  Text,
  Button,
  Image,
  Flex,
  HStack,
  Icon,
  Heading,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react';

import BookingIcon from '../../../assets/icons/Booking.svg';
import {
  RiCalendarEventFill,
  RiHospitalFill,
  RiTimerLine,
} from 'react-icons/ri';

export const CreateNewBooking = ({ dataBooking }) => {
  // console.log({ dataBooking });
  if (!dataBooking) {
    return (
      <Center
        border="3px"
        borderStyle="dashed"
        borderColor="primary.500"
        h={{ base: '48', md: '60', '2xl': '72' }}
        rounded="2xl"
        mb="14"
        bg="primary.50"
      >
        <Box textAlign="center">
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            fontWeight="medium"
            color="primary.600"
          >
            Anda tidak memilik jadwal konsultasi untuk hari ini. Apakah Anda
            ingin periksa ke dokter?
          </Text>
          <Button
            as={Link}
            to="/doctor/booking"
            colorScheme="primary"
            // size="lg"
            mt="4"
            fontWeight="bold"
            fontSize="md"
          >
            <Image src={BookingIcon} w="6" h="6" ml="-1" />
            <Box as="span" ml="2">
              Booking Dokter
            </Box>
          </Button>
        </Box>
      </Center>
    );
  }

  return (
    <LinkBox
      boxShadow="xl"
      px="10"
      pb="6"
      pt="4"
      mb="14"
      rounded="2xl"
      border="2px"
      borderStyle="dashed"
      borderColor="secondary.dark"
      bgColor="secondary.light"
    >
      <LinkOverlay as={Link} to={`/doctor/detail/${dataBooking?.id}`}>
        <Heading fontSize="2xl" color="primary.500" mb="2">
          Jadwal Anda hari ini
        </Heading>
      </LinkOverlay>
      <Flex
        // px="6"
        py="4"
        alignItems="center"
        direction={{ base: 'column', md: 'row' }}
      >
        <Box
          w={{ base: '24', md: '28' }}
          h={{ base: '24', md: '28' }}
          mb={{ base: '4', md: '0' }}
        >
          <Image rounded="full" src="/images/doctor.jpg" alt="foto dokter" />
        </Box>
        <Box flexGrow="1" pl={{ base: '0', md: '6' }} mt="-3">
          <Flex justify="space-between" mb={{ base: '1.5', md: '3' }}>
            <Box w="full">
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="bold"
                textAlign={{ base: 'center', md: 'left' }}
              >
                {dataBooking?.doctor_name}
              </Text>
              <Text
                mt="-1.5"
                color="secondary.dark"
                fontWeight="semibold"
                textAlign={{ base: 'center', md: 'left' }}
              >
                {dataBooking?.profession === 'Doctor'
                  ? 'Dokter'
                  : dataBooking?.profession}
              </Text>
              <Text
                mt="-1"
                // color="secondary.dark"
                fontWeight="semibold"
                fontSize="sm"
                textAlign={{ base: 'center', md: 'left' }}
              >
                {dataBooking?.service_name}
              </Text>
            </Box>
          </Flex>
          <Flex
            color="secondary.dark"
            fontSize="sm"
            fontWeight="medium"
            direction={{ base: 'column', md: 'row' }}
          >
            <HStack mr="6" spacing="1">
              <Icon color="secondary.dark" as={RiHospitalFill} w="5" h="5" />
              <span>{dataBooking?.institution?.name}</span>
            </HStack>
            <HStack mr="6" spacing="1">
              <Icon
                color="secondary.dark"
                as={RiCalendarEventFill}
                w="5"
                h="5"
              />
              <span>
                {dataBooking?.schedule?.days}, {dataBooking?.schedule?.date}
              </span>
            </HStack>
            <HStack mr="6" spacing="1">
              <Icon color="secondary.dark" as={RiTimerLine} w="5" h="5" />
              <span>{dataBooking?.schedule?.available_time}</span>
            </HStack>
          </Flex>
        </Box>
      </Flex>
      <HStack spacing="8">
        <HStack spacing="4">
          <Text fontWeight="semibold" fontSize="sm">
            Booking Status{' '}
          </Text>
          {dataBooking?.booking_status === 'booked' ? (
            <Box
              bgColor="orange.200"
              px="3"
              py="1"
              fontWeight="bold"
              rounded="full"
              color="orange.800"
              textTransform="uppercase"
              fontSize="sm"
            >
              {dataBooking?.booking_status}
            </Box>
          ) : dataBooking?.booking_status === 'done' ? (
            <Box
              bgColor="blue.200"
              px="3"
              py="1"
              fontWeight="bold"
              rounded="full"
              color="blue.800"
              textTransform="uppercase"
              fontSize="sm"
            >
              Checked In
            </Box>
          ) : dataBooking?.booking_status === 'cancel' ? (
            <Box
              bgColor="red.200"
              px="3"
              py="1"
              fontWeight="bold"
              rounded="full"
              color="red.800"
              textTransform="uppercase"
              fontSize="sm"
            >
              {dataBooking?.booking_status}
            </Box>
          ) : (
            <Box
              bgColor="gray.200"
              px="3"
              py="1"
              fontWeight="bold"
              rounded="full"
              color="gray.800"
              textTransform="uppercase"
              fontSize="sm"
            >
              {dataBooking?.booking_status}
            </Box>
          )}
        </HStack>
        <HStack spacing="4">
          <Text fontSize="sm" fontWeight="semibold">
            Payment Status
          </Text>
          {dataBooking?.booking_orders[0]?.status === 'paid' ? (
            <Box
              bgColor="green.200"
              px="3"
              py="1"
              fontWeight="bold"
              rounded="full"
              color="green.800"
              textTransform="uppercase"
              fontSize="sm"
            >
              {dataBooking?.booking_orders[0]?.status}
            </Box>
          ) : dataBooking?.booking_orders[0]?.status?.toLowerCase() ===
            'admin verification' ? (
            <Box
              bgColor="blue.200"
              px="3"
              py="1"
              fontWeight="bold"
              rounded="full"
              color="blue.800"
              textTransform="uppercase"
              fontSize="sm"
            >
              Under Confirmation
            </Box>
          ) : (
            <Box
              bgColor="gray.200"
              px="3"
              py="1"
              fontWeight="bold"
              rounded="full"
              color="gray.800"
              textTransform="uppercase"
              fontSize="sm"
            >
              Pending
            </Box>
          )}
        </HStack>
      </HStack>
    </LinkBox>
  );
};
