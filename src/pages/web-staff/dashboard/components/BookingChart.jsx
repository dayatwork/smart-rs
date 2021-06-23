import { Box, Heading } from '@chakra-ui/react';
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
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getBookingList } from '../../../../api/booking-services/booking';

export const BookingChart = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);

  const { data: dataBookingList, isLoading: isLoadingBookingList } = useQuery(
    ['booking-list', selectedInstitution],
    () => getBookingList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

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
          booking.status === 'canceled'
      ).length,
      checkedin: dataBookingList?.data?.filter(
        booking =>
          new Date(booking.date).toLocaleDateString('id-ID') === date &&
          booking.status === 'done'
      ).length,
    };
  });

  // console.log({ dataChart });

  // const chartBarData = [
  //   {
  //     name: 'Page A',
  //     booking: 4000,
  //     canceled: 2400,
  //     checkedin: 1200,
  //   },
  //   {
  //     name: 'Page B',
  //     booking: 3000,
  //     canceled: 1398,
  //     checkedin: 1200,
  //   },
  //   {
  //     name: 'Page C',
  //     booking: 2000,
  //     canceled: 9800,
  //     checkedin: 1200,
  //   },
  //   {
  //     name: 'Page D',
  //     booking: 2780,
  //     canceled: 3908,
  //     checkedin: 1200,
  //   },
  //   {
  //     name: 'Page E',
  //     booking: 1890,
  //     canceled: 4800,
  //     checkedin: 1200,
  //   },
  //   {
  //     name: 'Page F',
  //     booking: 2390,
  //     canceled: 3800,
  //     checkedin: 1200,
  //   },
  //   {
  //     name: 'Page G',
  //     booking: 3490,
  //     canceled: 4300,
  //     checkedin: 1200,
  //   },
  // ];

  return (
    <Box
      mb="12"
      bgColor="white"
      p="10"
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
