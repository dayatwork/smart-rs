import React from 'react';
import {
  Box,
  Heading,
  Grid,
  GridItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';

import { BookingStatus } from './BookingStatus';
import { BookingChart } from './BookingChart';
import { getBookingStatistic } from 'api/booking-services/statistic';

export const BookingStatistics = ({ selectedInstitution, cookies }) => {
  const statColSpan = useBreakpointValue({ base: 4, '2xl': 1 });
  const graphColSpan = useBreakpointValue({ base: 4, '2xl': 3 });

  const { data } = useQuery(
    ['booking-statistic', selectedInstitution],
    () => getBookingStatistic(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
    }
  );

  // if (isLoading) {
  //   return (
  //     <Center py="10">
  //       <Spinner
  //         thickness="4px"
  //         emptyColor="gray.200"
  //         color="purple.500"
  //         size="xl"
  //       />
  //     </Center>
  //   );
  // }

  // console.log({ data });

  return (
    <Box>
      <Heading
        fontSize={{ base: 'lg', '2xl': 'xl' }}
        mb={{ base: '2', '2xl': '4' }}
      >
        Booking Statistics
      </Heading>
      <BookingStatus
        total={data?.bookingData?.total || 0}
        cancel={data?.bookingData?.cancel || 0}
        checkedIn={data?.bookingData?.checked || 0}
        examination={data?.bookingData?.examination || 0}
        mb="4"
      />
      <BookingChart selectedInstitution={selectedInstitution} />
      <Grid
        display={{ base: 'block', '2xl': 'grid' }}
        gridTemplateColumns="repeat(4,1fr)"
        maxH="96"
        gap="4"
        gridTemplateRows="minmax(100px, 465px)"
      >
        <GridItem colSpan={statColSpan}></GridItem>
        <GridItem colSpan={graphColSpan}></GridItem>
      </Grid>
    </Box>
  );
};
