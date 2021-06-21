/* eslint-disable react/display-name */
import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Heading,
  Spinner,
  useDisclosure,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { HiPencilAlt } from 'react-icons/hi';

import { getPatientTypes } from '../../../../api/master-data-services/patient-type';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddPatientTypeModal,
  EditPatientTypeDrawer,
} from '../../../../components/web-staff/master/patient-type';
import { BackButton } from '../../../../components/shared/BackButton';

export const PatientTypePage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedPatientType, setSelectedPatientType] = useState(null);

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const {
    onOpen: onDrawerOpen,
    isOpen: isDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery('master-patient-types', () => getPatientTypes(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    (patientTypeId) => {
      const patientType = res?.data.find(
        (patientType) => patientType.id === patientTypeId,
      );
      setSelectedPatientType(patientType);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data],
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map((patientType) => {
        return {
          id: patientType.id,
          name: patientType.name,
        };
      }),
    [res?.data, isSuccess],
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        // Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <HStack>
            <IconButton
              aria-label="Edit"
              colorScheme="blackAlpha"
              icon={<HiPencilAlt />}
              onClick={() => handleEdit(row.original.id)}
            />
          </HStack>
        ),
      },
    ],
    [handleEdit],
  );

  return (
    <Box>
      {isFetching && <Spinner top="8" right="12" position="absolute" color="purple" />}

      <AddPatientTypeModal isOpen={isModalOpen} onClose={onModalClose} />
      <EditPatientTypeDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedPatientType={selectedPatientType}
        setSelectedPatientType={setSelectedPatientType}
      />

      <BackButton to="/master" text="Back to Master List" />
      <Heading mb="6" fontSize="3xl">
        Patient Type
      </Heading>
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={3}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Patient Type
          </Button>
        }
      />
    </Box>
  );
};
