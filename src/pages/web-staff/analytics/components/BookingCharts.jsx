import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Chart from 'react-apexcharts';

export const BookingCharts = () => {
  const series = [
    {
      name: 'booked',
      data: [31, 40, 59, 45, 46, 70, 42],
    },
    {
      name: 'processed',
      data: [26, 32, 45, 32, 34, 52, 41],
    },
    {
      name: 'canceled',
      data: [5, 8, 14, 13, 12, 18, 1],
      color: 'red',
    },
  ];
  const options = {
    chart: {
      height: 300,
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-09-19T00:00:00.000Z',
        '2018-09-20T01:30:00.000Z',
        '2018-09-21T02:30:00.000Z',
        '2018-09-22T03:30:00.000Z',
        '2018-09-23T04:30:00.000Z',
        '2018-09-24T05:30:00.000Z',
        '2018-09-25T06:30:00.000Z',
      ],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  };

  return (
    <Box bg="white" p="4" rounded="md" boxShadow="md">
      <Heading mb="5" textAlign="center">
        Booking
      </Heading>
      <Chart options={options} series={series} type="area" width="100%" />
    </Box>
  );
};
