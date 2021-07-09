import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, Button, useDisclosure, Spinner } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { getRadiologyList } from '../../../../../api/radiology-services/radiology';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';
import { ImagingDetailsModal } from '../../../../../components/web-staff/event-node/imaging';

import { PrivateComponent, Permissions } from '../../../../../access-control';

export const ImagingPatientList = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);
  const [selectedRadiology, setSelectedRadiology] = useState(null);

  const {
    data: dataRadiologyList,
    isSuccess: isSuccessRadiologyList,
    isLoading: isLoadingRadiologyList,
    isFetching: isFetchingRadiologyList,
  } = useQuery(
    ['radiology-list', selectedInstitution],
    () => getRadiologyList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );
  // console.log({ dataRadiologyList });

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  const handleStart = useCallback(
    detail => {
      setSelectedRadiology(detail);
      onDetailOpen();
    },
    [onDetailOpen]
  );

  const data = React.useMemo(
    () =>
      isSuccessRadiologyList &&
      dataRadiologyList?.data?.map(radiology => {
        // console.log("radiology", radiology);
        return {
          id: radiology?.id,
          patient_id: radiology?.patient_id,
          patient_name: radiology?.patient_data?.name,
          patient_number: radiology?.patient_data?.patient_number,
          radiology_type: radiology?.type_data?.name,
          soap_id: radiology?.soap_id,
          employee_name: radiology?.employee_data?.name,
          status: radiology?.status,
          date: radiology?.date,
          type_name: radiology?.type_data?.name,
          description: radiology?.description,
          time: radiology?.time,
        };
      }),
    [dataRadiologyList?.data, isSuccessRadiologyList]
  );

  // console.log({ dataRadiologyList });

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
        Header: 'Radiology Type',
        accessor: 'type_name',
      },
      {
        Header: 'Employee Name',
        accessor: 'employee_name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value === 'requested') {
            return <Badge colorScheme="orange">{value}</Badge>;
          }
          if (value === 'process') {
            return <Badge colorScheme="blue">{value}</Badge>;
          }
          if (value === 'completed') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
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
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          // console.log({ row });
          // if (row.original.status === "Done") {
          //   return (
          //     <Button
          //       variant="link"
          //       size="sm"
          //       colorScheme="purple"
          //       as={Link}
          //       to={`/events/imaging/${row.original.id}`}
          //     >
          //       Details
          //     </Button>
          //   );
          // }
          if (row.original.status === 'requested') {
            return (
              <PrivateComponent permission={Permissions.createImaging}>
                <Button
                  // variant="link"
                  size="sm"
                  colorScheme="purple"
                  onClick={() => handleStart(row.original)}
                >
                  Start
                </Button>
              </PrivateComponent>
            );
          }
          if (row.original.status === 'process') {
            return (
              <PrivateComponent permission={Permissions['read-detailImaging']}>
                <Button
                  as={Link}
                  variant="link"
                  colorScheme="purple"
                  to={`/events/imaging/details/${row.original.id}`}
                >
                  Details
                </Button>
              </PrivateComponent>
            );
          }
          return null;
          // return (
          //   <Button
          //     as={Link}
          //     variant="link"
          //     colorScheme="purple"
          //     to={`/events/imaging/details/${row.original.id}`}
          //   >
          //     Details
          //   </Button>
          // );
        },
      },
    ],
    [handleStart]
  );
  return (
    <>
      {isFetchingRadiologyList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <ImagingDetailsModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        selectedRadiology={selectedRadiology}
      />
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoadingRadiologyList}
        skeletonCols={9}
      />
    </>
  );
};
