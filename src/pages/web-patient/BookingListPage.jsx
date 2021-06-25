/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Flex, Heading } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';

import { WebPatientNav, Wrapper } from '../../components/web-patient/shared';
import {
  BookingTable,
  CreateNewBooking,
} from '../../components/web-patient/booking-list';
import { getUserBookingList } from '../../api/booking-services/booking';

export const BookingListPage = () => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataBooking,
    isLoading: isLoadingBooking,
    isSuccess: isSuccessBooking,
  } = useQuery('user-booking-list', () => getUserBookingList(cookies.token));

  console.log({ dataBooking });

  const data1 = React.useMemo(
    () =>
      isSuccessBooking &&
      dataBooking?.data?.map(booking => {
        return {
          id: booking.id,
          doctor_name: booking.doctor_name,
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
        Header: 'Layanan',
        accessor: 'service_name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value?.toLowerCase() === 'booked') {
            return <Badge colorScheme="orange">{value}</Badge>;
          }
          if (value?.toLowerCase() === 'done') {
            return <Badge colorScheme="blue">Checked In</Badge>;
          }
          if (value?.toLowerCase() === 'cancel') {
            return <Badge colorScheme="red">{value}</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
      },
      {
        Header: 'Payment Status',
        accessor: 'payment_status',
        Cell: ({ value }) => {
          if (value?.toLowerCase() === 'paid') {
            return <Badge colorScheme="green">{value}</Badge>;
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
              colorScheme="blue"
            >
              Detail
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <Flex direction="column" bg="gray.100" minH="100vh">
      <Helmet>
        <title>Doctor | SMART-RS</title>
      </Helmet>
      <WebPatientNav active="doctor" />
      <Wrapper>
        <Heading fontSize="2xl" mb="4">
          Pemeriksaan Dokter
        </Heading>
        {/* Booking Step */}
        <CreateNewBooking />

        <Heading fontSize="lg" mb="4">
          Order History
        </Heading>

        <BookingTable
          data={data1 || []}
          columns={columns1}
          isLoading={isLoadingBooking}
          skeletonCols={4}
        />
      </Wrapper>
    </Flex>
  );
};
