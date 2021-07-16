import React from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import Chart from 'react-apexcharts';

function randomInRange(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

export const LearningGrowthCharts = () => {
  const jumlahStaff = [300];
  const staffActive = [300 * 0.9];
  const staffTrained = [300 * 0.6];
  const staffProductivity = [75];

  for (let i = 1; i < 7; i++) {
    const added =
      jumlahStaff[i - 1] +
      (jumlahStaff[i - 1] * randomInRange(1, 10) * 0.01) / 12;
    const activeAdded = added * randomInRange(80, 95) * 0.01;
    const trainAdded = added * randomInRange(50, 65) * 0.01;
    const prodAdded = randomInRange(70, 120);

    staffActive.push(activeAdded);
    staffTrained.push(trainAdded);
    jumlahStaff.push(added);
    staffProductivity.push(prodAdded);
  }

  console.log({ staffProductivity });

  const series = [
    {
      name: 'Jumlah staff',
      data: jumlahStaff,
    },
    {
      name: 'Jumlah staff Aktif',
      data: staffActive,
    },
    {
      name: 'Jumlah staff yang ditraining',
      data: staffTrained,
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    title: {
      text: 'Jumlah Staff',
      align: 'left',
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      max: 400,
      min: 0,
    },
    fill: {
      opacity: 1,
    },
    // tooltip: {
    //   y: {
    //     formatter: function (val) {
    //       return '$ ' + val + ' thousands';
    //     },
    //   },
    // },
  };

  const series1 = [
    {
      name: 'Produktivitas Staff',
      data: staffProductivity,
    },
  ];

  //
  const options1 = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    title: {
      text: 'Produktivitas Staff',
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      max: 200,
      min: 0,
    },
  };

  return (
    <Box bg="white" p="10" rounded="md" boxShadow="md">
      <Heading textAlign="center" mb="10">
        Learning & Growth
      </Heading>
      <SimpleGrid columns={2} gap="14" px="14">
        <Box>
          <Heading size="lg" textAlign="center" mb="4">
            Jumlah Staff
          </Heading>
          <Chart options={options} series={series} type="bar" width="100%" />
        </Box>
        <Box>
          <Heading size="lg" textAlign="center" mb="4">
            Produktivitas Staff
          </Heading>
          <Chart options={options1} series={series1} type="line" width="100%" />
        </Box>
      </SimpleGrid>
    </Box>
  );
};
