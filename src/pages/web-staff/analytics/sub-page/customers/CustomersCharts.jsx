import React from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import Chart from 'react-apexcharts';

import { kepuasan, pasien_baru, pasien_lama, total_pasien } from './data';

// function randomInRange(start, end) {
//   return Math.floor(Math.random() * (end - start + 1) + start);
// }

export const CustomersCharts = () => {
  const goBackDays = 30;
  const today = new Date();
  const datesSorted = [new Date().toISOString().split('T')[0]];
  // const totalPasien = [];
  // const pasienBaru = [];
  // const pasienLama = [];
  // const kepuasan = [];

  // for (let i = 0; i < 7; i++) {
  //   const value1 = randomInRange(190, 220);
  //   const value2 = Math.floor(value1 * randomInRange(15, 25) * 0.01);
  //   const value3 = value1 - value2;
  //   const value4 = randomInRange(65, 95);

  //   totalPasien.push(value1);
  //   pasienBaru.push(value2);
  //   pasienLama.push(value3);
  //   kepuasan.push(value4);
  // }

  for (let i = 0; i < goBackDays; i++) {
    const newDate = new Date(today.setDate(today.getDate() - 1))
      .toISOString()
      .split('T')[0];
    datesSorted.push(newDate);
  }

  const series1 = [
    {
      name: 'Kepuasan Pelanggan',
      data: kepuasan,
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
      categories: datesSorted,
      // categoris: date,
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Kepuasan Pelanggan (%)',
      },
    },

    title: {
      text: 'Kepuasan Pelanggan',
      align: 'left',
    },
  };

  const series = [
    {
      name: 'Total Pasien',
      // data: pasienLama,
      data: total_pasien,
    },
    {
      name: 'Pasien Lama',
      // data: pasienLama,
      data: pasien_lama,
    },
    {
      name: 'Pasien Baru',
      // data: pasienBaru,
      data: pasien_baru,
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
      categories: datesSorted,
      // categoris: date,
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    yaxis: {
      min: 0,
      // max: 100,
      title: {
        text: 'Jumlah Pasien (orang)',
      },
    },

    title: {
      text: 'Pasien',
      align: 'left',
    },
  };

  // const options = {
  //   chart: {
  //     type: 'area',
  //     height: 350,
  //     stacked: true,
  //     toolbar: {
  //       show: true,
  //     },
  //     zoom: {
  //       enabled: true,
  //     },
  //   },
  //   responsive: [
  //     {
  //       breakpoint: 480,
  //       options: {
  //         legend: {
  //           position: 'bottom',
  //           offsetX: -10,
  //           offsetY: 0,
  //         },
  //       },
  //     },
  //   ],
  //   plotOptions: {
  //     bar: {
  //       horizontal: false,
  //       borderRadius: 10,
  //     },
  //   },
  //   xaxis: {
  //     type: 'datetime',
  //     categories: datesSorted,
  //     // categories: date,
  //   },
  //   legend: {
  //     position: 'right',
  //     offsetY: 40,
  //   },
  //   fill: {
  //     opacity: 1,
  //   },
  //   title: {
  //     text: 'Pasien',
  //     align: 'left',
  //   },
  //   yaxis: {
  //     title: {
  //       text: 'Jumlah Pasien (orang)',
  //     },
  //   },
  // };

  return (
    <SimpleGrid columns={2} gap="14">
      <Box bg="white" p="10" rounded="md" boxShadow="md">
        <Heading size="lg" textAlign="center" mb="4">
          Pasien
        </Heading>
        <Chart options={options} series={series} type="area" width="100%" />
      </Box>
      <Box bg="white" p="10" rounded="md" boxShadow="md">
        <Heading size="lg" textAlign="center" mb="4">
          Kepuasan Pelanggan
        </Heading>
        <Chart options={options1} series={series1} type="area" width="100%" />
      </Box>
    </SimpleGrid>
  );
};
