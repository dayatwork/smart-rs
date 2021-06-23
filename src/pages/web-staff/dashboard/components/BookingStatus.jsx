import { Box, Center, Spinner, Stack, StackDivider } from '@chakra-ui/react';
import * as React from 'react';
import { HiCheckCircle, HiClock, HiExclamationCircle } from 'react-icons/hi';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { StatCard } from './StatCard';
import { getBookingList } from '../../../../api/booking-services/booking';

export const BookingStatus = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);

  const { data: dataBookingList, isLoading: isLoadingBookingList } = useQuery(
    ['booking-list', selectedInstitution],
    () => getBookingList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  if (isLoadingBookingList) {
    return (
      <Center py="10">
        <Spinner
          thickness="4px"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
        />
      </Center>
    );
  }

  console.log({ dataBookingList });

  return (
    <Box
      as="section"
      // p="6"
    >
      <Box
      // maxW={{
      //   base: 'xl',
      //   md: '7xl',
      // }}
      // mx="auto"
      // px={{
      //   base: '6',
      //   md: '8',
      // }}
      >
        <Box bg="white" p="10" rounded="xl" shadow="base">
          <Stack
            spacing="8"
            justify="space-between"
            direction={{
              base: 'column',
              md: 'row',
            }}
            divider={<StackDivider />}
          >
            <StatCard
              accentColor="green.500"
              icon={<HiClock />}
              data={{
                label: 'Total Booking',
                value: dataBookingList?.data?.length,
                change: -2.1,
              }}
            />
            <StatCard
              accentColor="red.500"
              icon={<HiExclamationCircle />}
              data={{
                label: 'Total Cancel',
                value: dataBookingList?.data?.filter(
                  booking => booking.booking_status === 'cancel'
                )?.length,
                change: 4.31,
              }}
            />
            <StatCard
              accentColor="cyan.500"
              icon={<HiCheckCircle />}
              data={{
                label: 'Total Checked In',
                value: dataBookingList?.data?.filter(
                  booking => booking.booking_status === 'done'
                )?.length,
                change: -4.5,
              }}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
