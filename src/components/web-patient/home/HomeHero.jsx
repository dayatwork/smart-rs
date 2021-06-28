import { Box, Button, Center, Heading, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import BookingIcon from '../../../assets/icons/Booking.svg';

export const HomeHero = ({ user }) => {
  // console.log({ user });
  return (
    <Box
      bg="white"
      py={{ base: '6', md: '10', lg: '12', '2xl': '14' }}
      px={{ base: '4', '2xl': '14' }}
      boxShadow="md"
      rounded="lg"
    >
      <Helmet>
        <title>Home | SMART-RS</title>
      </Helmet>
      <Center flexDirection="column" textAlign="center" h="full">
        <Heading size="xl" fontWeight="bold">
          Selamat datang, {user?.name}
        </Heading>
        <Text fontSize={{ base: 'lg', '2xl': 'xl' }} mt="3" color="gray.700">
          Bagaimana kondisi kesehatan anda hari ini? Apakah anda ingin
          konsultasi dengan dokter?
        </Text>

        <Button
          as={Link}
          to="/doctor/booking"
          colorScheme="blue"
          size="lg"
          mt="6"
          fontWeight="bold"
          fontSize="md"
        >
          <Image src={BookingIcon} w="8" h="8" ml="-1" />
          <Box as="span" ml="2">
            Booking Dokter
          </Box>
        </Button>
      </Center>
    </Box>
  );
};
