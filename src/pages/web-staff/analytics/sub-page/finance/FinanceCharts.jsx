import React from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import Chart from 'react-apexcharts';
import {
  BALANCE,
  // BRUTO,
  NET_PROFIT,
  PAYBACK_PERIOD,
  PEMASUKAN,
  PENGELUARAN,
  ROI,
  DATES,
} from './data';

export const FinanceCharts = () => {
  const series = [
    {
      name: 'Pemasukan',
      data: PEMASUKAN,
    },
    {
      name: 'Pengeluaran',
      data: PENGELUARAN,
    },
    {
      name: 'Net Profit',
      data: NET_PROFIT,
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
      type: 'datetime',
      categories: DATES,
    },
    yaxis: {
      title: {
        text: 'Uang (ratus juta)',
      },
      labels: {
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    title: {
      text: 'Profit',
      align: 'left',
    },
  };

  const series1 = [
    {
      name: 'Balance',
      data: BALANCE,
    },
  ];

  const options1 = {
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
      type: 'datetime',
      categories: DATES,
    },
    yaxis: {
      min: 0,
      title: {
        text: 'Balance',
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    title: {
      text: 'Balance',
      align: 'left',
    },
  };

  const series2 = [
    {
      name: 'ROI',
      data: ROI,
    },
  ];

  const options2 = {
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
      type: 'datetime',
      categories: DATES,
    },
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: 'ROI (%)',
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    title: {
      text: 'ROI',
      align: 'left',
    },
  };

  const series3 = [
    {
      name: 'Payback Period',
      data: PAYBACK_PERIOD,
    },
  ];

  const options3 = {
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
      type: 'datetime',
      categories: DATES,
    },
    yaxis: {
      min: 4,
      max: 11,
      title: {
        text: 'Payback Period (tahun)',
      },
    },

    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    title: {
      text: 'Payback Period',
      align: 'left',
    },
  };

  return (
    <SimpleGrid columns={2} gap="14">
      <Box bg="white" p="10" rounded="md" boxShadow="md">
        <Heading size="lg" textAlign="center" mb="4">
          Profit
        </Heading>
        <Chart options={options} series={series} type="area" width="100%" />
      </Box>
      <Box bg="white" p="10" rounded="md" boxShadow="md">
        <Heading size="lg" textAlign="center" mb="4">
          Balance
        </Heading>
        <Chart options={options1} series={series1} type="area" width="100%" />
      </Box>
      <Box bg="white" p="10" rounded="md" boxShadow="md">
        <Heading size="lg" textAlign="center" mb="4">
          ROI
        </Heading>
        <Chart options={options2} series={series2} type="area" width="100%" />
      </Box>
      <Box bg="white" p="10" rounded="md" boxShadow="md">
        <Heading size="lg" textAlign="center" mb="4">
          Payback Period
        </Heading>
        <Chart options={options3} series={series3} type="area" width="100%" />
      </Box>
    </SimpleGrid>
  );
};
