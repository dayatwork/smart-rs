/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Flex, Heading } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

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

  const data = React.useMemo(
    () =>
      isSuccessBooking &&
      dataBooking?.data?.map((booking) => {
        return {
          id: booking.id,
          doctor_name: booking.doctor_name,
          service_name: booking.service_name,
          status: booking.booking_status,
        };
      }),
    [isSuccessBooking, dataBooking?.data],
  );

  const columns = React.useMemo(
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
        Header: 'Detail',
        Cell: ({ row }) => {
          return (
            <Button
              as={Link}
              to={`/doctor/detail/${row.original.id}`}
              variant="link"
              colorScheme="blue">
              Detail
            </Button>
          );
        },
      },
    ],
    [],
  );

  return (
    <Flex direction="column" bg="gray.100" minH="100vh">
      <WebPatientNav active="doctor" />
      <Wrapper>
        <Heading fontSize="2xl" mb="4">
          Pemeriksaan Dokter
        </Heading>
        {/* Booking Step */}
        <CreateNewBooking />

        <Heading fontSize="lg" mb="4">
          History Pemeriksaan Dokter
        </Heading>

        <BookingTable
          data={data || []}
          columns={columns}
          isLoading={isLoadingBooking}
          skeletonCols={4}
        />
      </Wrapper>
    </Flex>
  );
};
