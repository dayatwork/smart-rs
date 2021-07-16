import React from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import Chart from 'react-apexcharts';

function randomInRange(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

export const BusinessProcessCharts = () => {
  const goBackDays = 49;
  const today = new Date();
  const datesSorted = [new Date().toISOString().split('T')[0]];
  const durasiPasien = [];
  const durasiTunggu = [];
  const durasiTemuDokter = [];
  const BOR = [];
  const LOS = [];
  const GDR = [];

  for (let i = 0; i < 50; i++) {
    const value1 = randomInRange(20, 200);
    const value2 = randomInRange(5, 120);
    const value3 = randomInRange(2, 20);
    const value4 = randomInRange(55, 90);
    const value5 = randomInRange(1, 20);
    // const value6 = randomInRange(3, 7);
    const value6 = randomInRange(3, 7);
    durasiPasien.push(value1);
    durasiTunggu.push(value2);
    durasiTemuDokter.push(value3);
    BOR.push(value4);
    LOS.push(value5);
    GDR.push(value6);
  }

  for (let i = 0; i < goBackDays; i++) {
    const newDate = new Date(today.setDate(today.getDate() - 1))
      .toISOString()
      .split('T')[0];
    datesSorted.push(newDate);
  }

  const series = [
    {
      name: 'Durasi Pasien di RS',
      data: durasiPasien,
    },
    {
      name: 'Durasi Tunggu',
      data: durasiTunggu,
    },
    {
      name: 'Durasi Temu Dokter',
      data: durasiTemuDokter,
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
    },
    yaxis: {
      title: {
        text: 'Durasi (menit)',
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },

    title: {
      text: 'Durasi',
      align: 'left',
    },
  };

  const series1 = [
    {
      name: 'BOR',
      data: BOR,
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
    },
    yaxis: {
      title: {
        text: 'Bed Occupancy Rate (%)',
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    title: {
      text: 'BOR',
      align: 'left',
    },
  };

  const series2 = [
    {
      name: 'LOS',
      data: LOS,
    },
  ];

  const options2 = {
    chart: {
      height: 100,
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
    },
    yaxis: {
      title: {
        text: 'Length of Stay (hari)',
      },
      min: 0,
      max: 22,
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    title: {
      text: 'LOS',
      align: 'left',
    },
  };

  const series3 = [
    {
      name: 'GDR',
      data: GDR,
    },
  ];

  const options3 = {
    chart: {
      height: 100,
      type: 'area',
      color: 'red',
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
    },
    yaxis: {
      min: 0,
      max: 10,
      title: {
        text: 'Gross Death Rate (%)',
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },

    title: {
      text: 'GDR',
      align: 'left',
    },
  };

  return (
    <Box bg="white" p="10" rounded="md" boxShadow="md">
      <Heading mb="6" textAlign="center">
        Proses Bisnis
      </Heading>
      <SimpleGrid columns={2} gap="14" px="14">
        <Box>
          <Heading size="lg" textAlign="center" mb="4">
            Durasi
          </Heading>
          <Chart options={options} series={series} type="area" width="100%" />
        </Box>
        <Box>
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
        </Box>
      </SimpleGrid>
    </Box>
  );
};
