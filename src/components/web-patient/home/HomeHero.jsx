import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import BookingDoctorIcon from '../../../assets/icons/BookingDoctorIcon';

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
          Selamat Datang, {user?.name}
        </Heading>
        <Text fontSize={{ base: 'lg', '2xl': 'xl' }} mt="3" color="gray.700">
          Bagaimana kondisi kesehatan Anda hari ini? Apakah Anda ingin
          konsultasi dengan dokter?
        </Text>

        <Button
          as={Link}
          to="/doctor/booking"
          colorScheme="primary"
          size="lg"
          mt="6"
          fontWeight="bold"
          fontSize="md"
          aria-label="booking-button"
        >
          {/* <Image src={BookingIcon} alt="booking-icon" w="8" h="8" ml="-1" /> */}
          {/* <Icon color="secondary.dark" as={BookingIcon} w="5" h="5" /> */}
          <BookingDoctorIcon width={36} aria-label="doctor-icon" height={36} />
          <Box as="span" ml="2">
            Temui Dokter
          </Box>
        </Button>
      </Center>
    </Box>
  );
};
