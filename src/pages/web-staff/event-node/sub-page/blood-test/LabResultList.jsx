import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Spinner } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { getLaboratoryResultList } from '../../../../../api/laboratory-services/result';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';

export const LabResultList = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataLaboratoryResultList,
    isSuccess: isSuccessLaboratoryResultList,
    isLoading: isLoadingLaboratoryResultList,
    isFetching: isFetchingLaboratoryResultList,
  } = useQuery(
    ['laboratory-result-list', selectedInstitution],
    () => getLaboratoryResultList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const data = React.useMemo(
    () =>
      isSuccessLaboratoryResultList &&
      dataLaboratoryResultList?.data?.map(result => {
        return {
          id: result?.id,
          patient_id: result?.patient?.id,
          patient_name: result?.patient?.name,
          employee_name: result?.employee?.name,
          blood_code: result?.blood?.code,
          blood_id: result?.blood_id,
          date: result?.date,
          time: result?.time,
        };
      }),
    [dataLaboratoryResultList?.data, isSuccessLaboratoryResultList]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Patient Name',
        accessor: 'patient_name',
      },
      {
        Header: 'Employee Name',
        accessor: 'employee_name',
      },
      {
        Header: 'Blood ID',
        accessor: 'blood_id',
      },
      {
        Header: 'Blood Code',
        accessor: 'blood_code',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Time',
        accessor: 'time',
      },

      {
        Header: 'Action',
        Cell: ({ row }) => {
          return (
            <Button
              as={Link}
              to={`/events/blood-test-result/${row.original.id}`}
              variant="link"
              colorScheme="purple"
            >
              Detail
            </Button>
          );
        },
      },
    ],
    []
  );

  console.log({ dataLaboratoryResultList });

  return (
    <>
      {isFetchingLaboratoryResultList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <PaginationTable
        columns={columns}
        data={data || []}
        skeletonCols={8}
        isLoading={isLoadingLaboratoryResultList}
      />
    </>
  );
};
