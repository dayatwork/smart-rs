import React from 'react';
import { Link } from 'react-router-dom';
import { Center, Box, Text, Button, Image } from '@chakra-ui/react';

import BookingIcon from '../../../assets/icons/Booking.svg';

export const CreateNewBooking = () => {
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
          Anda tidak memilik jadwal konsultasi untuk hari ini. Apakah Anda ingin
          periksa ke dokter?
        </Text>
        <Button
          as={Link}
          to="/doctor/booking"
          colorScheme="primary"
          dark
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
};
