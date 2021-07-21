import React from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import Chart from 'react-apexcharts';

import { jumlah_staff, produktivitas, staff_masuk } from './data';

// function randomInRange(start, end) {
//   return Math.floor(Math.random() * (end - start + 1) + start);
// }

const kehadiran = staff_masuk.map(
  (v, index) => (v / jumlah_staff[index]) * 100
);

export const LearningGrowthCharts = () => {
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
      name: 'Produktivitas',
      data: produktivitas,
    },
    {
      name: 'Kehadiran',
      data: kehadiran,
    },
  ];

  const options1 = {
    chart: {
      height: 350,
      type: 'line',
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
        text: 'Kehadiran & Produktivitas (%)',
      },
      labels: {
        formatter: function (val) {
          return val && val.toFixed(2);
        },
      },
    },

    title: {
      text: 'Kehadiran & Produktivitas',
      align: 'left',
    },
  };

  const series = [
    {
      name: 'Jumlah Staff',
      // data: pasienLama,
      data: jumlah_staff,
    },
    {
      name: 'Staff Masuk',
      // data: pasienLama,
      data: staff_masuk,
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: 'line',
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
      max: 400,
      title: {
        text: 'Jumlah Staff (orang)',
      },
    },

    title: {
      text: 'Staff',
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
          Jumlah Staff
        </Heading>
        <Chart options={options} series={series} type="line" width="100%" />
      </Box>
      <Box bg="white" p="10" rounded="md" boxShadow="md">
        <Heading size="lg" textAlign="center" mb="4">
          Kehadiran dan Produktivitas
        </Heading>
        <Chart options={options1} series={series1} type="line" width="100%" />
      </Box>
    </SimpleGrid>
  );
};

// import React from 'react';
// import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
// import Chart from 'react-apexcharts';

// function randomInRange(start, end) {
//   return Math.floor(Math.random() * (end - start + 1) + start);
// }

// export const LearningGrowthCharts = () => {
//   const jumlahStaff = [300];
//   const staffActive = [300 * 0.9];
//   const staffTrained = [300 * 0.6];
//   const staffProductivity = [75];

//   for (let i = 1; i < 7; i++) {
//     const added =
//       jumlahStaff[i - 1] +
//       (jumlahStaff[i - 1] * randomInRange(1, 10) * 0.01) / 12;
//     const activeAdded = added * randomInRange(80, 95) * 0.01;
//     const trainAdded = added * randomInRange(50, 65) * 0.01;
//     const prodAdded = randomInRange(70, 120);

//     staffActive.push(activeAdded);
//     staffTrained.push(trainAdded);
//     jumlahStaff.push(added);
//     staffProductivity.push(prodAdded);
//   }

//   console.log({ staffProductivity });

//   const series = [
//     {
//       name: 'Jumlah staff',
//       data: jumlahStaff,
//     },
//     {
//       name: 'Jumlah staff Aktif',
//       data: staffActive,
//     },
//     {
//       name: 'Jumlah staff yang ditraining',
//       data: staffTrained,
//     },
//   ];

//   const options = {
//     chart: {
//       type: 'bar',
//       height: 350,
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '55%',
//         endingShape: 'rounded',
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       show: true,
//       width: 2,
//       colors: ['transparent'],
//     },
//     title: {
//       text: 'Jumlah Staff',
//       align: 'left',
//     },
//     xaxis: {
//       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//     },

//     yaxis: {
//       title: {
//         text: 'Jumlah Staff (orang)',
//       },
//       labels: {
//         formatter: function (val) {
//           return val && val.toFixed(0);
//         },
//       },
//       max: 400,
//       min: 0,
//     },
//     fill: {
//       opacity: 1,
//     },
//     // tooltip: {
//     //   y: {
//     //     formatter: function (val) {
//     //       return '$ ' + val + ' thousands';
//     //     },
//     //   },
//     // },
//   };

//   const series1 = [
//     {
//       name: 'Produktivitas Staff',
//       data: staffProductivity,
//     },
//   ];

//   //
//   const options1 = {
//     chart: {
//       height: 350,
//       type: 'line',
//       zoom: {
//         enabled: false,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       curve: 'smooth',
//     },
//     title: {
//       text: 'Produktivitas Staff',
//       align: 'left',
//     },
//     grid: {
//       row: {
//         colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
//         opacity: 0.5,
//       },
//     },
//     xaxis: {
//       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//     },
//     yaxis: {
//       title: {
//         text: 'Produktivitas Staff (%)',
//       },
//       labels: {
//         formatter: function (val) {
//           return val && val.toFixed(0);
//         },
//       },
//       max: 200,
//       min: 0,
//     },
//   };

//   return (
//     <SimpleGrid columns={2} gap="14">
//       <Box bg="white" p="10" rounded="md" boxShadow="md">
//         <Heading size="lg" textAlign="center" mb="4">
//           Jumlah Staff
//         </Heading>
//         <Chart options={options} series={series} type="bar" width="100%" />
//       </Box>
//       <Box bg="white" p="10" rounded="md" boxShadow="md">
//         <Heading size="lg" textAlign="center" mb="4">
//           Produktivitas Staff
//         </Heading>
//         <Chart options={options1} series={series1} type="line" width="100%" />
//       </Box>
//     </SimpleGrid>
//   );
// };
