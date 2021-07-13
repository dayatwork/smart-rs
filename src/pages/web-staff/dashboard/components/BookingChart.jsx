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
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getBookingStatisticByDay } from '../../../../api/booking-services/statistic';

const formatData = data => {
  if (!data) return {};
  let formatted = {};

  data.forEach(v => (formatted[v.date] = v.total));

  return formatted;
};

export const BookingChart = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);
  const goBackDays = 7;
  const today = new Date();
  const datesSorted = [new Date().toISOString().split('T')[0]];

  for (let i = 0; i < goBackDays; i++) {
    const newDate = new Date(today.setDate(today.getDate() - 1))
      .toISOString()
      .split('T')[0];
    datesSorted.push(newDate);
  }

  const startDate = datesSorted[datesSorted.length - 1];
  const endDate = datesSorted[0];

  const { data: dataStatisticTotal } = useQuery(
    [
      'booking-graph-statistic',
      {
        startDate,
        endDate,
      },
    ],
    () =>
      getBookingStatisticByDay(cookies, {
        institution_id: selectedInstitution,
        startDate,
        endDate,
      }),
    {
      enabled:
        Boolean(selectedInstitution) && Boolean(startDate) && Boolean(endDate),
    }
  );
  const { data: dataStatisticCancel } = useQuery(
    [
      'booking-graph-statistic',
      {
        institution_id: selectedInstitution,
        startDate,
        endDate,
        booking_status: 'cancel',
      },
    ],
    () =>
      getBookingStatisticByDay(cookies, {
        startDate,
        endDate,
        booking_status: 'cancel',
      }),
    {
      enabled:
        Boolean(selectedInstitution) && Boolean(startDate) && Boolean(endDate),
    }
  );
  const { data: dataStatisticCheckedIn } = useQuery(
    [
      'booking-graph-statistic',
      {
        institution_id: selectedInstitution,
        startDate,
        endDate,
        booking_status: 'done',
      },
    ],
    () =>
      getBookingStatisticByDay(cookies, {
        startDate,
        endDate,
        booking_status: 'done',
      }),
    {
      enabled:
        Boolean(selectedInstitution) && Boolean(startDate) && Boolean(endDate),
    }
  );
  const { data: dataStatisticExamination } = useQuery(
    [
      'booking-graph-statistic',
      {
        institution_id: selectedInstitution,
        startDate,
        endDate,
        booking_status: 'examination',
      },
    ],
    () =>
      getBookingStatisticByDay(cookies, {
        startDate,
        endDate,
        booking_status: 'examination',
      }),
    {
      enabled:
        Boolean(selectedInstitution) && Boolean(startDate) && Boolean(endDate),
    }
  );

  const formattedTotal = formatData(dataStatisticTotal?.data);
  const formattedCancel = formatData(dataStatisticCancel?.data);
  const formattedCheckedIn = formatData(dataStatisticCheckedIn?.data);
  const formattedExamination = formatData(dataStatisticExamination?.data);

  const chartBarData = datesSorted.map(date => {
    // console.log({ date });
    return {
      name: date,
      booking: formattedTotal[date] || 0,
      // dataBookingList?.data?.filter(
      //   booking => new Date(booking.date).toLocaleDateString('id-ID') === date
      // ).length || 0,
      canceled: formattedCancel[date] || 0,
      // dataBookingList?.data?.filter(
      //   booking =>
      //     new Date(booking.date).toLocaleDateString('id-ID') === date &&
      //     booking.booking_status === 'cancel'
      // ).length || 0,
      checkedin:
        (formattedCheckedIn[date] || 0) + (formattedExamination[date] || 0),
      // dataBookingList?.data?.filter(
      //   booking =>
      //     new Date(booking.date).toLocaleDateString('id-ID') === date &&
      //     booking.booking_status === 'done'
      // ).length || 0,
    };
  });

  return (
    <Box
      mb="12"
      bgColor="white"
      px={{ base: '2', '2xl': '10' }}
      pt={{ base: '5', '2xl': '12' }}
      pb={{ base: '2', '2xl': '8' }}
      rounded="xl"
      shadow="base"
      overflow="auto"
    >
      <Box h={{ base: '60', '2xl': '72' }} minW="md">
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
