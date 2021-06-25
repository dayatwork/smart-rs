/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, Button, Divider, Flex, Heading } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';

import { WebPatientNav, Wrapper } from '../../components/web-patient/shared';
import {
  BookingTable,
  CreateNewBooking,
  OrderTable,
} from '../../components/web-patient/booking-list';
import { getUserBookingList } from '../../api/booking-services/booking';
import { getUserOrderList } from '../../api/payment-services/user-order';

export const BookingListPage = () => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataBooking,
    isLoading: isLoadingBooking,
    isSuccess: isSuccessBooking,
  } = useQuery('user-booking-list', () => getUserBookingList(cookies.token));

  console.log({ dataBooking });

  const {
    data: dataOrder,
    isLoading: isLoadingOrder,
    isSuccess: isSuccessOrder,
  } = useQuery('user-order-list', () => getUserOrderList(cookies));

  const data1 = React.useMemo(
    () =>
      isSuccessBooking &&
      dataBooking?.data?.map(booking => {
        return {
          id: booking.id,
          doctor_name: booking.doctor_name,
          service_name: booking.service_name,
          status: booking.booking_status,
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

  const data2 = React.useMemo(
    () =>
      isSuccessOrder &&
      dataOrder?.data?.map(order => {
        return {
          id: order.id,
          transaction_number: order.transaction_number,
          invoice_date: order.invoice_date,
          due_date: order.due_date,
          total_price: order.total_price,
          status: order.status,
          method_name: order.method_name,
        };
      }),
    [isSuccessOrder, dataOrder?.data]
  );

  const columns2 = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Transaction Number',
        accessor: 'transaction_number',
      },
      {
        Header: 'Invoice Date',
        accessor: 'invoice_date',
      },
      {
        Header: 'Due Date',
        accessor: 'due_date',
      },
      {
        Header: 'Total Price',
        accessor: 'total_price',
        Cell: ({ value }) => formatter.format(value),
      },
      {
        Header: 'Payment Method',
        accessor: 'method_name',
      },
      {
        Header: 'Status',
        accessor: 'status',
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
              to={`/doctor/order/${row.original.id}`}
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
          History Pemeriksaan Dokter
        </Heading>

        <BookingTable
          data={data1 || []}
          columns={columns1}
          isLoading={isLoadingBooking}
          skeletonCols={4}
        />

        <Divider my="4" />

        <Heading fontSize="lg" mb="4">
          History Order
        </Heading>

        <OrderTable
          data={data2 || []}
          columns={columns2}
          isLoading={isLoadingOrder}
          skeletonCols={8}
        />
      </Wrapper>
    </Flex>
  );
};

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});
