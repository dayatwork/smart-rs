import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Chart from 'react-apexcharts';
import { useQuery } from 'react-query';

import { getBookingStatisticByDay } from '../../../../api/booking-services/statistic';

export const BookingChart = ({ selectedInstitution, cookies }) => {
  const {
    data: dataStatisticTotal,
    isSuccess,
    isLoading,
  } = useQuery(
    ['booking-graph-statistic'],
    () =>
      getBookingStatisticByDay(cookies, {
        institution_id: selectedInstitution,
      }),
    {
      enabled: Boolean(selectedInstitution),
    }
  );

  console.log({ dataStatisticTotal });

  const series = [
    {
      name: 'Appointment',
      data: isSuccess
        ? dataStatisticTotal?.data
            ?.map(statistic => statistic.total)
            .slice(0, 7)
            .reverse()
        : [],
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'date',
      categories: isSuccess
        ? dataStatisticTotal?.data
            ?.map(statistic => statistic.date)
            .slice(0, 7)
            .reverse()
        : [],
    },
    yaxis: {
      title: {
        text: 'Appointment (orang)',
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },

    title: {
      text: 'Last 7 Days Appointment',
      align: 'left',
    },
  };

  if (isLoading) return null;

  return (
    <Box bg="white" p="6" rounded="md" boxShadow="md">
      <Heading size="lg" textAlign="center" mb="4">
        Appointment
      </Heading>
      <Chart options={options} series={series} type="bar" height={350} />
    </Box>
  );
};
