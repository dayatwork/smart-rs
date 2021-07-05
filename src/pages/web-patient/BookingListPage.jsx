/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaUsers } from 'react-icons/fa';

import { WebPatientNav, Wrapper } from '../../components/web-patient/shared';
import {
  BookingTable,
  CreateNewBooking,
} from '../../components/web-patient/booking-list';
import {
  getUserBookingList,
  getUserResponsibleBookingList,
} from '../../api/booking-services/booking';

export const BookingListPage = () => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataBooking,
    isLoading: isLoadingBooking,
    isSuccess: isSuccessBooking,
  } = useQuery('user-booking-list', () => getUserBookingList(cookies.token));

  const {
    data: dataBookingResponsible,
    isLoading: isLoadingBookingResponsible,
    isSuccess: isSuccessBookingResponsible,
  } = useQuery('user-responsible-booking-list', () =>
    getUserResponsibleBookingList(cookies.token)
  );

  const currentBooking = dataBooking?.data?.find(booking => {
    const bookingDate = new Date(booking.schedule.date)
      .toISOString()
      .split('T')[0];
    const currentDate = new Date().toISOString().split('T')[0];
    return bookingDate === currentDate;
  });

  const data1 = React.useMemo(
    () =>
      isSuccessBooking &&
      dataBooking?.data?.map(booking => {
        return {
          id: booking.id,
          doctor_name: booking.doctor_name,
          date: booking.schedule?.date,
          time: booking.schedule?.available_time,
          days: booking.schedule?.days,
          institution_name: booking.institution?.name,
          service_name: booking.service_name,
          status: booking.booking_status,
          payment_status: booking.booking_orders[0].status,
        };
      }),
    [isSuccessBooking, dataBooking?.data]
  );

  const columns1 = React.useMemo(
    () => [
      {
        Header: 'Dokter',
        accessor: 'doctor_name',
      },
      {
        Header: 'Rumah Sakit',
        accessor: 'institution_name',
      },
      {
        Header: 'Layanan',
        accessor: 'service_name',
      },
      {
        Header: 'Jadwal',
        Cell: ({ row }) => (
          <Box>
            {/* <Text>{row.original.days}</Text> */}
            <Text>{row.original.date}</Text>
            <Text>{row.original.time}</Text>
          </Box>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value?.toLowerCase() === 'booked') {
            return <Badge colorScheme="orange">{value}</Badge>;
          }
          if (value?.toLowerCase() === 'done') {
            return <Badge colorScheme="green">Checked-In</Badge>;
          }
          if (value?.toLowerCase() === 'cancel') {
            return <Badge colorScheme="red">{value}</Badge>;
          }
          if (value?.toLowerCase() === 'examination') {
            return <Badge colorScheme="blue">Ongoing</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
      },
      {
        Header: 'Status Pembayaran',
        accessor: 'payment_status',
        Cell: ({ value }) => {
          if (value?.toLowerCase() === 'paid') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          if (
            value?.toLowerCase() === 'admin verification' ||
            value?.toLowerCase() === 'under confirmation'
          ) {
            return <Badge colorScheme="blue">Under Confirmation</Badge>;
          }
          if (
            value?.toLowerCase() === 'pending payment' ||
            value?.toLowerCase() === 'pending'
          ) {
            return <Badge>Pending</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
      },
      {
        Header: 'Detail',
        Cell: ({ row }) => {
          return (
            <Button
              as={Link}
              to={`/doctor/detail/${row.original.id}`}
              variant="link"
              colorScheme="primary"
            >
              Detail
            </Button>
          );
        },
      },
    ],
    []
  );

  const data2 = React.useMemo(
    () =>
      isSuccessBookingResponsible &&
      dataBookingResponsible?.data?.map(booking => {
        return {
          id: booking.id,
          doctor_name: booking.doctor_name,
          date: booking.schedule?.date,
          time: booking.schedule?.available_time,
          days: booking.schedule?.days,
          institution_name: booking.institution?.name,
          service_name: booking.service_name,
          status: booking.booking_status,
          payment_status: booking.booking_orders[0].status,
        };
      }),
    [isSuccessBookingResponsible, dataBookingResponsible?.data]
  );

  const columns2 = React.useMemo(
    () => [
      {
        Header: 'Dokter',
        accessor: 'doctor_name',
      },
      {
        Header: 'Rumah Sakit',
        accessor: 'institution_name',
      },
      {
        Header: 'Layanan',
        accessor: 'service_name',
      },
      {
        Header: 'Jadwal',
        Cell: ({ row }) => (
          <Box>
            {/* <Text>{row.original.days}</Text> */}
            <Text>{row.original.date}</Text>
            <Text>{row.original.time}</Text>
          </Box>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value?.toLowerCase() === 'booked') {
            return <Badge colorScheme="orange">{value}</Badge>;
          }
          if (value?.toLowerCase() === 'done') {
            return <Badge colorScheme="green">Checked-In</Badge>;
          }
          if (value?.toLowerCase() === 'cancel') {
            return <Badge colorScheme="red">{value}</Badge>;
          }
          if (value?.toLowerCase() === 'examination') {
            return <Badge colorScheme="blue">Ongoing</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
      },
      {
        Header: 'Status Pembayaran',
        accessor: 'payment_status',
        Cell: ({ value }) => {
          if (value?.toLowerCase() === 'paid') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          if (value?.toLowerCase() === 'admin verification') {
            return <Badge colorScheme="blue">Under Confirmation</Badge>;
          }
          if (value?.toLowerCase() === 'pending payment') {
            return <Badge>Pending</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
      },
      {
        Header: 'Detail',
        Cell: ({ row }) => {
          return (
            <Button
              as={Link}
              to={`/doctor/detail/${row.original.id}`}
              variant="link"
              colorScheme="primary"
            >
              Detail
            </Button>
          );
        },
      },
    ],
    []
  );

  console.log({ dataBooking });

  return (
    <Flex
      direction="column"
      bg="secondary.lighter"
      minH="100vh"
      maxW="100vw"
      overflow="hidden"
    >
      <Helmet>
        <title>Doctor | SMART-RS</title>
      </Helmet>
      <WebPatientNav active="doctor" />
      <Wrapper>
        {/* <Heading fontSize="2xl" mb="4">
          Pemeriksaan Dokter
        </Heading> */}
        {/* Booking Step */}
        <CreateNewBooking dataBooking={currentBooking} />

        <Heading fontSize="2xl" mb="6" mt="-4">
          Riwayat Transaksi
        </Heading>

        <Box mb="4">
          <HStack mb="2">
            <Icon color="secondary.dark" w="5" h="5" as={FaUser} />
            <Heading fontSize="lg" fontWeight="medium">
              Pribadi
            </Heading>
          </HStack>
          <BookingTable
            data={data1 || []}
            columns={columns1}
            isLoading={isLoadingBooking}
            skeletonCols={7}
            filterPlaceholder="Filter berdasarkan nama dokter..."
            noDataPlaceholder="Belum ada riwayat transaksi"
          />
        </Box>

        <HStack mb="2">
          <Icon color="secondary.dark" w="5" h="5" as={FaUsers} />
          <Heading fontSize="lg" fontWeight="medium">
            Tanggungan
          </Heading>
        </HStack>
        <BookingTable
          data={data2 || []}
          columns={columns2}
          isLoading={isLoadingBookingResponsible}
          skeletonCols={7}
          filterPlaceholder="Filter berdasarkan nama dokter..."
          noDataPlaceholder="Belum ada riwayat transaksi"
        />
      </Wrapper>
    </Flex>
  );
};
