/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

import PaginationTable from '../../../../shared/tables/PaginationTable';

export const Appointment = () => {
  const data = React.useMemo(
    () => [
      {
        id: 1,
        date: {
          day: '22 Maret 2020',
          time: '10:00 AM',
        },
        doctor: 'Dr. Jane Cooper',
        category: 'Poliklinik Umum',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus placerat massa sapien, quis placerat mauris interdum et. In vitae ligula a orci volutpat commodo quis in arcu',
      },
      {
        id: 2,
        date: {
          day: '22 Maret 2020',
          time: '10:00 AM',
        },
        doctor: 'Dr. Jane Cooper',
        category: 'Poliklinik Umum',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus placerat massa sapien, quis placerat mauris interdum et. In vitae ligula a orci volutpat commodo quis in arcu',
      },
    ],
    [],
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Tanggal',
        accessor: 'date',
        Cell: ({ value }) => (
          <Box>
            <Box as="span" display="block" fontWeight="semibold">
              {value.day}
            </Box>
            <Box as="span" display="block">
              {value.time}
            </Box>
          </Box>
        ),
        // isNumeric: true,
      },
      {
        Header: 'Nama Dokter',
        accessor: 'doctor',
      },
      {
        Header: 'Kategori',
        accessor: 'category',
      },
      {
        Header: 'Keterangan',
        accessor: 'description',
      },
      {
        Header: 'Detail SOAP',
        accessor: 'id',
        Cell: ({ value }) => (
          <Button
            variant="link"
            as={Link}
            to={`/events/examination/soap/${value}`}
            colorScheme="purple">
            Soap.pdf
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <Box py="4">
      <Flex justify="space-between">
        <Flex
          p="10"
          align={{ base: 'baseline', md: 'center' }}
          justify="space-between"
          bg="white"
          boxShadow="md"
          direction={{ base: 'column', md: 'row' }}
          mb="8"
          minW="2xl">
          <Flex align="center" px={{ base: '0', '2xl': '4' }} mb={{ base: '4', lg: '0' }}>
            <Avatar
              size="xl"
              name="Segun Adebayo"
              src="https://bit.ly/broken-link"
              mr={{ base: '8', '2xl': '10' }}
            />
            <Box>
              <Text fontSize="2xl" fontWeight="bold">
                Zahrina Anwar
              </Text>
              <Text fontWeight="semibold" color="gray.600">
                Patient ID: QWE123
              </Text>
            </Box>
          </Flex>
          <Box>
            <Text fontSize="lg" fontWeight="semibold">
              Patient ID
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="purple.500">
              4257321
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Heading mb="3" fontSize="lg">
        Appointment List
      </Heading>
      <PaginationTable columns={columns} data={data} />
    </Box>
  );
};
