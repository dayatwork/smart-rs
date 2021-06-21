/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';

import PaginationTable from '../../../../../../components/shared/tables/PaginationTable';

export const SoapHistory = () => {
  const data = React.useMemo(
    () => [
      {
        id: 1,
        date: {
          day: '22 Maret 2020',
          time: '10:00 AM',
        },
        doctor: 'Dr. Jane Cooper',
        category: 'Poliklinik Umum',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus placerat massa sapien, quis placerat mauris interdum et. In vitae ligula a orci volutpat commodo quis in arcu',
      },
      {
        id: 2,
        date: {
          day: '22 Maret 2020',
          time: '10:00 AM',
        },
        doctor: 'Dr. Jane Cooper',
        category: 'Poliklinik Umum',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus placerat massa sapien, quis placerat mauris interdum et. In vitae ligula a orci volutpat commodo quis in arcu',
      },
    ],
    [],
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Tanggal SOAP',
        accessor: 'date',
        Cell: ({ value }) => (
          <Box>
            <Box as="span" display="block" fontWeight="semibold">
              {value.day}
            </Box>
            <Box as="span" display="block">
              {value.time}
            </Box>
          </Box>
        ),
        // isNumeric: true,
      },
      {
        Header: 'Nama Dokter',
        accessor: 'doctor',
      },
      {
        Header: 'Kategori',
        accessor: 'category',
      },
      {
        Header: 'Keterangan',
        accessor: 'description',
      },
      {
        Header: 'Detail SOAP',
        accessor: 'id',
        Cell: ({ value }) => (
          <Button
            variant="link"
            as={Link}
            to={`/events/examination/soap/${value}`}
            colorScheme="purple">
            Soap.pdf
          </Button>
        ),
      },
    ],
    [],
  );
  return (
    <Box>
      {/* <FilteringTable columns={columns} data={data} /> */}
      <PaginationTable columns={columns} data={data} />
    </Box>
  );
};
