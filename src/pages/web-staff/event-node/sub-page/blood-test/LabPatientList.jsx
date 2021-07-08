import React, { useState, useCallback } from 'react';
import {
  Badge,
  Box,
  Button,
  useDisclosure,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { getLaboratoryBloodList } from '../../../../../api/laboratory-services/blood';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';
import {
  CreateTestResultModal,
  EditBloodDataDrawer,
} from '../../../../../components/web-staff/event-node/blood-test';
import { PrivateComponent, Permissions } from '../../../../../access-control';

export const LabPatientList = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);
  const [selectedBloodData, setSelectedBloodData] = useState(null);

  const {
    isOpen: isUpdateBloodDataOpen,
    onOpen: onUpdateBloodDataOpen,
    onClose: onUpdateBloodDataClose,
  } = useDisclosure();

  const {
    isOpen: isCreateTestResultOpen,
    onOpen: onCreateTestResultOpen,
    onClose: onCreateTestResultClose,
  } = useDisclosure();

  const {
    data: dataLaboratoryBloodList,
    isSuccess: isSuccessLaboratoryBloodList,
    isLoading: isLoadingLaboratoryBloodList,
    isFetching: isFetchingLaboratoryBloodList,
  } = useQuery(
    ['laboratory-blood-list', selectedInstitution],
    () => getLaboratoryBloodList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  // console.log({ dataLaboratoryBloodList });

  const handleUpdate = useCallback(
    id => {
      const bloodData = dataLaboratoryBloodList?.data.find(
        blood => blood.id === id
      );
      setSelectedBloodData(bloodData);
      onUpdateBloodDataOpen();
    },
    [onUpdateBloodDataOpen, dataLaboratoryBloodList?.data]
  );

  const handleCreateResult = useCallback(
    id => {
      const bloodData = dataLaboratoryBloodList?.data.find(
        blood => blood.id === id
      );
      setSelectedBloodData(bloodData);
      onCreateTestResultOpen();
    },
    [onCreateTestResultOpen, dataLaboratoryBloodList?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccessLaboratoryBloodList &&
      dataLaboratoryBloodList?.data?.map(laboratory => {
        // console.log("laboratory", laboratory);
        return {
          id: laboratory?.id,
          patient_id: laboratory?.patient?.id,
          patient_name: laboratory?.patient?.name,
          patient_number: laboratory?.patient?.patient_number,
          laboratory_category: laboratory?.test_type?.name,
          soap_id: laboratory?.soap_id,
          employee_name: laboratory?.employee?.name,
          blood_status: laboratory?.blood_status,
          code: laboratory?.code,
          description: laboratory?.description,
          draw_time: laboratory?.draw_time,
          location: laboratory?.location,
        };
      }),
    [dataLaboratoryBloodList?.data, isSuccessLaboratoryBloodList]
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
        Header: 'Lab Category',
        accessor: 'laboratory_category',
      },
      {
        Header: 'Employee Name',
        accessor: 'employee_name',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Code',
        accessor: 'code',
      },
      {
        Header: 'Draw Time',
        accessor: 'draw_time',
      },

      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Blood Status',
        accessor: 'blood_status',
        Cell: ({ value }) => {
          if (value === 'completed') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          if (row.original.blood_status === 'completed') {
            return null;
          }
          return (
            <Stack align="start">
              <PrivateComponent permission={Permissions.updateBloodTest}>
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => handleUpdate(row?.original?.id)}
                >
                  Update
                </Button>
              </PrivateComponent>
              <PrivateComponent permission={Permissions.createBloodResult}>
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => handleCreateResult(row?.original?.id)}
                >
                  Create Result
                </Button>
              </PrivateComponent>
            </Stack>
          );
        },
      },
    ],
    [handleUpdate, handleCreateResult]
  );

  return (
    <>
      {isFetchingLaboratoryBloodList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <EditBloodDataDrawer
        isOpen={isUpdateBloodDataOpen}
        onClose={onUpdateBloodDataClose}
        selectedBloodData={selectedBloodData}
        selectedInstitution={selectedInstitution}
      />
      <CreateTestResultModal
        isOpen={isCreateTestResultOpen}
        onClose={onCreateTestResultClose}
        selectedBloodData={selectedBloodData}
        selectedInstitution={selectedInstitution}
      />
      <PaginationTable
        columns={columns}
        data={data || []}
        skeletonCols={10}
        isLoading={isLoadingLaboratoryBloodList}
      />
    </>
  );
};
