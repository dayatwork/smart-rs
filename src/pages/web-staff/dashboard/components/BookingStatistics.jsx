import React from 'react';
import { Box } from '@chakra-ui/react';
import { useQuery } from 'react-query';

import { BookingStatus } from './BookingStatus';
import { getBookingStatistic } from 'api/booking-services/statistic';

export const BookingStatistics = ({ selectedInstitution, cookies }) => {
  const { data } = useQuery(
    ['booking-statistic', selectedInstitution],
    () => getBookingStatistic(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
    }
  );

  return (
    <Box mb="6">
      <BookingStatus
        total={data?.bookingData?.total || 0}
        cancel={data?.bookingData?.cancel || 0}
        checkedIn={data?.bookingData?.checked || 0}
        examination={data?.bookingData?.examination || 0}
        mb="4"
      />
    </Box>
  );
};
