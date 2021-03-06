import { Box, Stack, StackDivider } from '@chakra-ui/react';
import * as React from 'react';
import { HiCheckCircle, HiClock, HiExclamationCircle } from 'react-icons/hi';

import { StatCard } from './StatCard';

export const BookingStatus = ({
  total = 0,
  checkedIn = 0,
  examination = 0,
  cancel = 0,
  ...rest
}) => {
  // console.log({ total, cancel, examination, checkedIn });
  return (
    <Box
      as="section"
      {...rest}
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
        <Box
          bg="white"
          p={{ base: '6', '2xl': '10' }}
          rounded="xl"
          shadow="base"
        >
          <Stack
            spacing="8"
            justify="space-between"
            direction={{
              base: 'column',
              md: 'row',
            }}
            // direction="column"
            divider={<StackDivider />}
          >
            <StatCard
              accentColor="green.500"
              icon={<HiClock />}
              data={{
                label: 'Total Booking',
                // value: dataBookingList?.data?.length || 0,
                value: total,
                change: -2.1,
              }}
            />
            <StatCard
              accentColor="red.500"
              icon={<HiExclamationCircle />}
              data={{
                label: 'Total Cancel',
                // value:
                //   dataBookingList?.data?.filter(
                //     booking => booking.booking_status === 'cancel'
                //   )?.length || 0,
                value: cancel,
                change: 4.31,
              }}
            />
            <StatCard
              accentColor="cyan.500"
              icon={<HiCheckCircle />}
              data={{
                label: 'Total Checked In',
                // value:
                //   dataBookingList?.data?.filter(
                //     booking => booking.booking_status === 'done'
                //   )?.length || 0,
                value: checkedIn + examination,
                change: -4.5,
              }}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
