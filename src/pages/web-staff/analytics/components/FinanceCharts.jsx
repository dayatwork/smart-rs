import React from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import Chart from 'react-apexcharts';
import {
  BALANCE,
  BRUTO,
  NET_PROFIT,
  PAYBACK_PERIOD,
  PEMASUKAN,
  PENGELUARAN,
  ROI,
  DATES,
} from '../data';

// function randomInRange(start, end) {
//   return Math.floor(Math.random() * (end - start + 1) + start);
// }

export const FinanceCharts = () => {
  console.log({ BALANCE: BALANCE.length });
  console.log({ BRUTO: BRUTO.length });
  console.log({ NET_PROFIT: NET_PROFIT.length });
  console.log({ PAYBACK_PERIOD: PAYBACK_PERIOD.length });
  console.log({ PEMASUKAN: PEMASUKAN.length });
  console.log({ PENGELUARAN: PENGELUARAN.length });
  console.log({ ROI: ROI.length });
  console.log({ DATES: DATES.length });
  // const goBackDays = 49;
  // const today = new Date();
  // const datesSorted = [new Date().toISOString().split('T')[0]];
  // const durasiPasien = [];
  // const durasiTunggu = [];
  // const durasiTemuDokter = [];
  // const BOR = [];
  // const LOS = [];
  // const GDR = [];

  // for (let i = 0; i < 50; i++) {
  //   const value1 = randomInRange(20, 200);
  //   const value2 = randomInRange(5, 120);
  //   const value3 = randomInRange(2, 20);
  //   const value4 = randomInRange(55, 90);
  //   const value5 = randomInRange(1, 20);
  //   // const value6 = randomInRange(3, 7);
  //   const value6 = randomInRange(3, 7);
  //   durasiPasien.push(value1);
  //   durasiTunggu.push(value2);
  //   durasiTemuDokter.push(value3);
  //   BOR.push(value4);
  //   LOS.push(value5);
  //   GDR.push(value6);
  // }

  // for (let i = 0; i < goBackDays; i++) {
  //   const newDate = new Date(today.setDate(today.getDate() - 1))
  //     .toISOString()
  //     .split('T')[0];
  //   datesSorted.push(newDate);
  // }

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
    // {
    //   name: 'Balance',
    //   data: BALANCE,
    // },
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

  // const series1 = [
  //   {
  //     name: 'BOR',
  //     data: BOR,
  //   },
  // ];

  // const options1 = {
  //   chart: {
  //     height: 350,
  //     type: 'area',
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   stroke: {
  //     curve: 'smooth',
  //   },
  //   xaxis: {
  //     type: 'datetime',
  //     categories: datesSorted,
  //   },
  //   tooltip: {
  //     x: {
  //       format: 'dd/MM/yy HH:mm',
  //     },
  //   },
  //   title: {
  //     text: 'BOR',
  //     align: 'left',
  //   },
  // };

  // const series2 = [
  //   {
  //     name: 'LOS',
  //     data: LOS,
  //   },
  // ];

  // const options2 = {
  //   chart: {
  //     height: 100,
  //     type: 'area',
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   stroke: {
  //     curve: 'smooth',
  //   },
  //   xaxis: {
  //     type: 'datetime',
  //     categories: datesSorted,
  //   },
  //   yaxis: {
  //     min: 0,
  //     max: 22,
  //   },
  //   tooltip: {
  //     x: {
  //       format: 'dd/MM/yy HH:mm',
  //     },
  //   },
  //   title: {
  //     text: 'LOS',
  //     align: 'left',
  //   },
  // };

  // const series3 = [
  //   {
  //     name: 'GDR',
  //     data: GDR,
  //   },
  // ];

  // const options3 = {
  //   chart: {
  //     height: 100,
  //     type: 'area',
  //     color: 'red',
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   stroke: {
  //     curve: 'smooth',
  //   },
  //   xaxis: {
  //     type: 'datetime',
  //     categories: datesSorted,
  //   },
  //   yaxis: {
  //     min: 0,
  //     max: 10,
  //   },
  //   tooltip: {
  //     x: {
  //       format: 'dd/MM/yy HH:mm',
  //     },
  //   },
  //   title: {
  //     text: 'GDR',
  //     align: 'left',
  //   },
  // };

  return (
    <Box bg="white" p="10" rounded="md" boxShadow="md">
      <Heading mb="6" textAlign="center">
        Keuangan
      </Heading>
      <SimpleGrid columns={2} gap="14" px="14">
        <Box>
          <Heading size="lg" textAlign="center" mb="4">
            Profit
          </Heading>
          <Chart options={options} series={series} type="area" width="100%" />
        </Box>
        <Box>
          <Heading size="lg" textAlign="center" mb="4">
            Balance
          </Heading>
          <Chart options={options1} series={series1} type="area" width="100%" />
        </Box>
        <Box>
          <Heading size="lg" textAlign="center" mb="4">
            ROI
          </Heading>
          <Chart options={options2} series={series2} type="area" width="100%" />
        </Box>
        <Box>
          <Heading size="lg" textAlign="center" mb="4">
            Payback Period
          </Heading>
          <Chart options={options3} series={series3} type="area" width="100%" />
        </Box>
        {/* <Box>
          <Heading size="lg" textAlign="center" mb="4">
            BOR
          </Heading>
          <Chart options={options1} series={series1} type="area" width="100%" />
        </Box>
        <Box>
          <Heading size="lg" textAlign="center" mb="4">
            LOS
          </Heading>
          <Chart options={options2} series={series2} type="area" width="100%" />
        </Box>
        <Box>
          <Heading size="lg" textAlign="center" mb="4">
            GDR
          </Heading>
          <Chart options={options3} series={series3} type="area" width="100%" />
        </Box> */}
      </SimpleGrid>
    </Box>
  );
};
