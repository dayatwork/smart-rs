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
  CheckboxGroup,
  HStack,
  Checkbox,
  Switch,
  Stack,
  useBreakpointValue,
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

const allFilter = ['booked', 'cancel', 'done', 'examination', 'complete'];

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
  const [filter, setFilter] = useState(allFilter);
  const [isToday, setIsToday] = useState(true);
  const checkboxSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const stackSpacing = useBreakpointValue({ base: '4', md: '8' });

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
        ?.filter(booking => filter.includes(booking.booking_status))
        .filter(booking => {
          // console.log({ booking });
          if (isToday) {
            return (
              new Date(booking?.date).toISOString() ===
              new Date(new Date().toISOString().split('T')[0]).toISOString()
            );
          }
          return booking;
        })
        // ?.filter(
        //   booking =>
        //     booking.booking_status === 'booked' ||
        //     booking.booking_status === 'cancel'
        // )
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
    [dataBookingList?.data, isSuccessBookingList, filter, isToday]
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
        accessor: 'date',
        Cell: ({ value, row }) => {
          return (
            <Box>
              <Text mb="1">{row?.original?.days}</Text>
              <Text mb="1">{value}</Text>
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
          if (value === 'booked') {
            return <Badge colorScheme="yellow">{value}</Badge>;
          }
          if (value === 'done') {
            return <Badge colorScheme="green">checked-in</Badge>;
          }
          if (value === 'cancel') {
            return <Badge colorScheme="red">{value}</Badge>;
          }
          if (value === 'examination') {
            return <Badge colorScheme="blue">{value}</Badge>;
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

  // console.log({ filter });

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
        <>
          <Stack
            mb="4"
            spacing={stackSpacing}
            direction={{ base: 'column', md: 'row' }}
            align="center"
          >
            <HStack>
              <Text
                fontWeight="semibold"
                fontSize={{ base: 'sm', md: 'md' }}
                mt={{ base: '-1.5', md: '0' }}
                color="gray.500"
              >
                Only Today
              </Text>
              <Switch
                colorScheme="purple"
                isChecked={isToday}
                onChange={e => setIsToday(e.target.checked)}
              />
            </HStack>

            <CheckboxGroup
              colorScheme="purple"
              defaultValue={filter}
              onChange={setFilter}
              size={checkboxSize}
            >
              <HStack>
                <Checkbox fontWeight="semibold" color="gray.500" value="booked">
                  Booked
                </Checkbox>
                <Checkbox fontWeight="semibold" color="gray.500" value="cancel">
                  Cancel
                </Checkbox>
                <Checkbox fontWeight="semibold" color="gray.500" value="done">
                  Checked-in
                </Checkbox>
                <Checkbox
                  fontWeight="semibold"
                  color="gray.500"
                  value="examination"
                >
                  Examination
                </Checkbox>
                <Checkbox
                  fontWeight="semibold"
                  color="gray.500"
                  value="complete"
                >
                  Complete
                </Checkbox>
              </HStack>
            </CheckboxGroup>
          </Stack>
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
        </>
      )}
    </Box>
  );
};
