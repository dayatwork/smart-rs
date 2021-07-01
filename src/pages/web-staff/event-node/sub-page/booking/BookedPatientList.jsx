/* eslint-disable react/display-name */
import React, { useState, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Spinner,
  Text,
  useDisclosure,
  Select,
  useToast,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../../contexts/authContext';
import {
  getBookingList,
  cancelBooking,
} from '../../../../../api/booking-services/booking';
import { getInstitutions } from '../../../../../api/institution-services/institution';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../components/shared/BackButton';
import { CancelBookingAlert } from '../../../../../components/web-staff/event-node/booking';
import { PrivateComponent, Permissions } from '../../../../../access-control';

export const BookedPatientList = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const queryClient = useQueryClient();

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    data: dataBookingList,
    isSuccess: isSuccessBookingList,
    isLoading: isLoadingBookingList,
    isFetching: isFetchingBookingList,
  } = useQuery(
    ['booking-list', selectedInstitution],
    () => getBookingList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  // console.log({ dataBookingList });

  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onClose: onCancelClose,
  } = useDisclosure();

  const onCancelBookingClick = useCallback(
    bookingId => {
      const booking = dataBookingList?.data.find(
        booking => booking.id === bookingId
      );
      setSelectedBooking(booking);
      onCancelOpen();
    },
    [onCancelOpen, dataBookingList?.data]
  );

  const handleCancel = async id => {
    try {
      setIsLoadingCancel(true);
      await cancelBooking(cookies, id);
      await queryClient.invalidateQueries('booking-list');
      setIsLoadingCancel(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Cancel booking success`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onCancelClose();
    } catch (error) {
      setIsLoadingCancel(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Cancel booking gagal`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const data = React.useMemo(
    () =>
      isSuccessBookingList &&
      dataBookingList?.data
        ?.filter(
          booking =>
            booking.booking_status === 'booked' ||
            booking.booking_status === 'cancel'
        )
        .map(booking => {
          return {
            id: booking?.id,
            patient_name: booking?.patient_name,
            service_name: booking?.service_name,
            schedule_date: booking?.schedule_date,
            schedule_time: booking?.schedule_time,
            doctor_name: booking?.doctor_name,
            poli: booking?.poli,
            status: booking?.booking_status,
            date: booking?.date,
            days: booking?.days,
            time: booking?.time,
            transaction_number: booking?.transaction_number,
            payment_status: booking?.booking_orders[0].status,
          };
        }),
    [dataBookingList?.data, isSuccessBookingList]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Nama Pasien',
        accessor: 'patient_name',
      },
      {
        Header: 'Transaction Number',
        accessor: 'transaction_number',
      },
      {
        Header: 'Layanan',
        accessor: 'service_name',
      },
      {
        Header: 'Jadwal',
        Cell: ({ row }) => {
          return (
            <Box>
              <Text mb="1">{row?.original?.days}</Text>
              <Text mb="1">{row?.original?.date}</Text>
              <Text>{row?.original?.time}</Text>
            </Box>
          );
        },
      },
      {
        Header: 'Dokter',
        accessor: 'doctor_name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          let color = 'gray';
          if (value === 'booked') {
            color = 'yellow';
          }
          if (value === 'done') {
            color = 'green';
          }
          if (value === 'cancel') {
            color = 'red';
          }

          return <Badge colorScheme={color}>{value}</Badge>;
        },
      },
      {
        Header: 'Payment Status',
        accessor: 'payment_status',
        Cell: ({ value }) => {
          if (value === 'paid') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          if (row.original.status === 'booked') {
            return (
              <PrivateComponent permission={Permissions.updateBookingDoctor}>
                <Button
                  onClick={() => onCancelBookingClick(row?.original?.id)}
                  variant="link"
                  colorScheme="red"
                >
                  Cancel Booking
                </Button>
              </PrivateComponent>
            );
          }
          return null;
        },
      },
    ],
    [onCancelBookingClick]
  );

  return (
    <Box>
      {isFetchingBookingList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <CancelBookingAlert
        isOpen={isCancelOpen}
        onClose={onCancelClose}
        selectedBooking={selectedBooking}
        handleCancel={handleCancel}
        isLoadingCancel={isLoadingCancel}
      />

      <BackButton to="/events" text="Back to Events List" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Booking List
      </Heading>
      {user?.role?.alias === 'super-admin' && (
        <FormControl id="name" mb="4" maxW="xs">
          <FormLabel>Institution</FormLabel>
          <Select
            name="institution"
            value={selectedInstitution}
            onChange={e => setSelectedInstitution(e.target.value)}
          >
            <option value="">Select Institution</option>
            {isSuccessInstitution &&
              resInstitution?.data?.map(institution => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
          </Select>
        </FormControl>
      )}
      {selectedInstitution && (
        <PaginationTable
          columns={columns}
          data={data || []}
          skeletonCols={9}
          isLoading={isLoadingBookingList}
          action={
            <PrivateComponent permission={Permissions.createBookingDoctor}>
              <Button
                as={Link}
                to="/events/booking/create"
                leftIcon={<FaPlus />}
                colorScheme="purple"
              >
                Add New Booking
              </Button>
            </PrivateComponent>
          }
          size="sm"
        />
      )}
    </Box>
  );
};
