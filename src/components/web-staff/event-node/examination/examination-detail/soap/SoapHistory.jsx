/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Text } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getPatientSoaps } from '../../../../../../api/medical-record-services/soap';

import PaginationTable from '../../../../../../components/shared/tables/PaginationTable';

export const SoapHistory = ({ patientId, institutionId }) => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataPatientSoaps,
    isSuccess,
    isLoading,
  } = useQuery(
    ['patient-soap-list', patientId],
    () => getPatientSoaps(cookies, patientId),
    {
      enabled: Boolean(patientId),
    }
  );

  console.log({ patientId });
  console.log({ dataPatientSoaps });

  const data = React.useMemo(
    () =>
      isSuccess &&
      dataPatientSoaps?.data
        ?.filter(soap => soap.status === 'completed')
        .map(soap => ({
          id: soap.id,
          doctor_name: soap.doctor?.name,
          employee_number: soap.doctor?.employee_number,
          patient_name: soap.patient_data?.name,
          patient_number: soap.patient_data?.patient_number,
          transaction_number: soap.transaction_number,
          soap_number: soap.soap_number,
          date: soap.date,
        })),
    [isSuccess, dataPatientSoaps?.data]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Tanggal SOAP',
        accessor: 'date',
        Cell: ({ value }) => (
          <Box as="span" display="block" fontWeight="semibold">
            {value?.split('T')[0]}
          </Box>
        ),
        // isNumeric: true,
      },
      {
        Header: 'Nama Dokter',
        accessor: 'doctor_name',
        Cell: ({ value, row }) => (
          <Box>
            <Text mb="1">{value}</Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray.600">
              {row.original.employee_number}
            </Text>
          </Box>
        ),
      },
      {
        Header: 'Nama Patient',
        accessor: 'patient_name',
        Cell: ({ value, row }) => (
          <Box>
            <Text mb="1">{value}</Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray.600">
              {row.original.patient_number}
            </Text>
          </Box>
        ),
      },
      {
        Header: 'Transaction Number',
        accessor: 'transaction_number',
      },
      {
        Header: 'Detail',
        Cell: ({ row }) => (
          <Button
            variant="link"
            as={Link}
            to={`/events/examination/result/${row.original.id}`}
            colorScheme="purple"
          >
            Detail
          </Button>
        ),
      },
    ],
    []
  );
  return (
    <Box>
      {/* <FilteringTable columns={columns} data={data} /> */}
      <PaginationTable
        columns={columns}
        data={data || []}
        skeletonCols={5}
        isLoading={isLoading}
      />
    </Box>
  );
};
