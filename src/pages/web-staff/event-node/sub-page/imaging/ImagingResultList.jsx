import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Spinner } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getRadiologyResultList } from '../../../../../api/radiology-services/result';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';

export const ImagingResultList = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataRadiologyResultList,
    isSuccess: isSuccessRadiologyResultList,
    isLoading: isLoadingRadiologyResultList,
    isFetching: isFetchingRadiologyResultList,
  } = useQuery(
    ['radiology-result-list', selectedInstitution],
    () => getRadiologyResultList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const data = React.useMemo(
    () =>
      isSuccessRadiologyResultList &&
      dataRadiologyResultList?.data?.map(result => {
        return {
          id: result?.id,
          radiology_id: result?.radiology_id,
          patient_id: result?.patient_id,
        };
      }),
    [dataRadiologyResultList?.data, isSuccessRadiologyResultList]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Radiology ID',
        accessor: 'radiology_id',
      },
      {
        Header: 'Patient ID',
        accessor: 'patient_id',
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          return (
            <Button
              variant="link"
              size="sm"
              colorScheme="purple"
              as={Link}
              to={`/events/imaging-result/${row.original.id}`}
            >
              Details
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      {isFetchingRadiologyResultList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoadingRadiologyResultList}
        skeletonCols={4}
      />
    </>
  );
};
