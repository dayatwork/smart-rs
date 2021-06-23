/* eslint-disable react/display-name */
import React, { useState, useCallback, useContext } from 'react';
import {
  Badge,
  Box,
  FormControl,
  FormLabel,
  Heading,
  Spinner,
  Text,
  Select,
  Switch,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../../contexts/authContext';
import { getBookingList } from '../../../../../api/booking-services/booking';
import { getInstitutions } from '../../../../../api/institution-services/institution';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../components/shared/BackButton';
import { CheckInModal } from '../../../../../components/web-staff/event-node/checkin';
import { PrivateComponent, Permissions } from '../../../../../access-control';

export const CheckinPatientList = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);

  const {
    isOpen: isCheckInOpen,
    onOpen: onCheckInOpen,
    onClose: onCheckInClose,
  } = useDisclosure();

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

  const handleCheckIn = useCallback(
    bookingId => {
      const booking = dataBookingList?.data.find(
        booking => booking.id === bookingId
      );
      setSelectedBooking(booking);
      onCheckInOpen();
    },
    [onCheckInOpen, dataBookingList?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccessBookingList &&
      dataBookingList?.data
        ?.filter(booking =>
          checkedIn
            ? booking.booking_status === 'done'
            : booking.booking_status === 'booked'
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
          };
        }),
    [dataBookingList?.data, isSuccessBookingList, checkedIn]
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
        Header: 'Action',
        Cell: ({ row }) => {
          if (row.original.status === 'done') return null;
          return (
            <PrivateComponent permission={Permissions.createCheckIn}>
              <Button
                size="sm"
                colorScheme="green"
                onClick={() => handleCheckIn(row.original.id)}
                disabled={row.original.status !== 'booked'}
              >
                Check In
              </Button>
            </PrivateComponent>
          );
        },
      },
    ],
    [handleCheckIn]
  );

  return (
    <Box>
      {isFetchingBookingList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <CheckInModal
        onClose={onCheckInClose}
        isOpen={isCheckInOpen}
        selectedBooking={selectedBooking}
      />
      <BackButton to="/events" text="Back to Events List" />
      <Heading mb="6" fontSize="3xl">
        Check-in List
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
          skeletonCols={8}
          isLoading={isLoadingBookingList}
          size="sm"
          action={
            <Box p="2">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="check-in" mb="0">
                  Checked-In
                </FormLabel>
                <Switch
                  id="check-in"
                  size="lg"
                  defaultChecked={checkedIn}
                  checked={checkedIn}
                  colorScheme="purple"
                  onChange={e => setCheckedIn(e.target.checked)}
                />
              </FormControl>
            </Box>
          }
        />
      )}
    </Box>
  );
};
