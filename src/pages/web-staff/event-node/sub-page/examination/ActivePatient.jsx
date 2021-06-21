/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, Button, Spinner } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getSoaps } from '../../../../../api/medical-record-services/soap';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';

export const ActivePatient = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataSoapList,
    isSuccess: isSuccessSoapList,
    isLoading: isLoadingSoapList,
    isFetching: isFetchingSoapList,
  } = useQuery(
    ['soap-list', 'process', selectedInstitution],
    () => getSoaps(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) },
  );

  const data = React.useMemo(
    () =>
      isSuccessSoapList &&
      dataSoapList?.data.map((soap) => ({
        id: soap?.id,
        soap_date: soap?.date,
        soap_number: soap?.soap_number,
        patient_id: soap?.patient_id,
        patient_name: soap?.patient_data?.name,
        patient_number: soap?.patient_data?.patient_number,
        patient_status: soap?.patient_data?.critical,
        doctor_id: soap?.doctor_id,
        status: soap?.status,
        transaction_number: soap?.transaction_number,
      })),
    [dataSoapList?.data, isSuccessSoapList],
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Date',
        accessor: 'soap_date',
        Cell: ({ value }) => <Box>{value?.split('T')[0]}</Box>,
      },
      {
        Header: 'Patient Name',
        accessor: 'patient_name',
      },
      {
        Header: 'Patient Number',
        accessor: 'patient_number',
      },
      {
        Header: 'Transaction Number',
        accessor: 'transaction_number',
      },
      {
        Header: 'Patient Status',
        accessor: 'patient_status',
        Cell: ({ value }) => (
          <Box
            as="span"
            rounded="md"
            fontWeight="semibold"
            color={value === 'Critical' ? 'red.500' : 'black'}>
            {value}
          </Box>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <Badge colorScheme="blue">{value}</Badge>,
      },
      {
        Header: 'Action',

        Cell: () => (
          <Button size="sm" p="2" rounded="md" fontWeight="semibold" colorScheme="green">
            Call Now
          </Button>
        ),
      },
      {
        Header: 'Details',
        Cell: ({ row }) => (
          <Button
            size="sm"
            colorScheme="purple"
            variant="outline"
            as={Link}
            to={`/events/examination/details/${row.original.id}`}>
            Details
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <Box py="6">
      {isFetchingSoapList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <PaginationTable
        skeletonCols={9}
        columns={columns}
        data={data || []}
        isLoading={isLoadingSoapList}
      />
    </Box>
  );
};
