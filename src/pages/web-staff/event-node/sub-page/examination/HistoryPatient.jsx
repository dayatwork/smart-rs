/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, Button, Spinner } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getSoaps } from '../../../../../api/medical-record-services/soap';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';

export const HistoryPatient = ({ selectedInstitution, fromPatientMenu }) => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataSoapList,
    isSuccess: isSuccessSoapList,
    isLoading: isLoadingSoapList,
    isFetching: isFetchingSoapList,
  } = useQuery(
    ['soap-list', 'completed', selectedInstitution],
    () => getSoaps(cookies, selectedInstitution, 'completed'),
    { enabled: Boolean(selectedInstitution) }
  );

  const data = React.useMemo(
    () =>
      isSuccessSoapList &&
      dataSoapList?.data.map(soap => ({
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
    [dataSoapList?.data, isSuccessSoapList]
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
        Header: 'Examination Status',
        accessor: 'status',
        Cell: ({ value }) => <Badge colorScheme="green">{value}</Badge>,
      },

      {
        Header: 'Result',
        Cell: ({ row }) => (
          <Button
            size="sm"
            colorScheme="purple"
            variant="outline"
            as={Link}
            to={
              fromPatientMenu
                ? `/patient/soap-result/${row.original.id}`
                : `/events/examination/result/${row.original.id}`
            }
          >
            Result
          </Button>
        ),
      },
    ],
    [fromPatientMenu]
  );

  return (
    <Box py="6">
      {isFetchingSoapList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <PaginationTable
        skeletonCols={7}
        columns={columns}
        data={data || []}
        isLoading={isLoadingSoapList}
      />
    </Box>
  );
};
