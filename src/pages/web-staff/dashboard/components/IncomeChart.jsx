import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Chart from 'react-apexcharts';
import { useQuery } from 'react-query';

import { getIncomeList } from '../../../../api/finance-services/income';

export const IncomeChart = ({ selectedInstitution, cookies }) => {
  const goBackDays = 30;
  const today = new Date();
  const datesSorted = [new Date().toISOString().split('T')[0]];

  for (let i = 0; i < goBackDays; i++) {
    const newDate = new Date(today.setDate(today.getDate() - 1))
      .toISOString()
      .split('T')[0];
    datesSorted.push(newDate);
  }

  const {
    data: res,
    isLoading,
    isSuccess,
  } = useQuery(
    ['income-list', selectedInstitution],
    () => getIncomeList(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
    }
  );

  const statistics = res?.data?.reduce((map, obj) => {
    if (map[obj.date]) {
      map[obj.date] = Number(map[obj.date]) + Number(obj.total);
    } else {
      map[obj.date] = Number(obj.total);
    }
    return map;
  }, {});

  const series = [
    {
      name: 'Appointment',
      data: isSuccess ? Object.values(statistics).reverse() : [],
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
      categories: isSuccess ? Object.keys(statistics).reverse() : [],
    },
    yaxis: {
      title: {
        text: 'Income (IDR)',
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },

    title: {
      text: 'Last 7 Days Income',
      align: 'left',
    },
  };

  if (isLoading) return null;

  return (
    <Box bg="white" p="6" rounded="md" boxShadow="md">
      <Heading size="lg" textAlign="center" mb="4">
        Daily Income
      </Heading>
      <Chart options={options} series={series} type="area" height={350} />
    </Box>
  );
};
