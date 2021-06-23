import { Box } from '@chakra-ui/react';
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';

export const BookingChart = ({ selectedInstitution, dataBookingList }) => {
  var goBackDays = 7;

  var today = new Date();
  var datesSorted = [new Date().toLocaleDateString('id-ID')];

  for (var i = 0; i < goBackDays; i++) {
    var newDate = new Date(
      today.setDate(today.getDate() - 1)
    ).toLocaleDateString('id-ID');
    datesSorted.push(newDate);
  }

  const chartBarData = datesSorted.map(date => {
    return {
      name: date,
      booking: dataBookingList?.data?.filter(
        booking => new Date(booking.date).toLocaleDateString('id-ID') === date
      ).length,
      canceled: dataBookingList?.data?.filter(
        booking =>
          new Date(booking.date).toLocaleDateString('id-ID') === date &&
          booking.booking_status === 'cancel'
      ).length,
      checkedin: dataBookingList?.data?.filter(
        booking =>
          new Date(booking.date).toLocaleDateString('id-ID') === date &&
          booking.booking_status === 'done'
      ).length,
    };
  });

  return (
    <Box
      mb="12"
      bgColor="white"
      px="10"
      pt="12"
      pb="8"
      rounded="xl"
      shadow="base"
      overflow="auto"
    >
      <Box h="72" minW="md">
        <ChartBar data={chartBarData} />
      </Box>
    </Box>
  );
};

const ChartBar = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="booking" fill="#38A169" />
        <Bar dataKey="canceled" fill="#E53E3E" />
        <Bar dataKey="checkedin" fill="#00B5D8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(ChartBar);
