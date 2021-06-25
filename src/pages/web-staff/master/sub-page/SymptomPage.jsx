/* eslint-disable react/display-name */
import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { HiPencilAlt } from 'react-icons/hi';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddSymptomModal,
  EditSymptomDrawer,
} from '../../../../components/web-staff/master/symptom';
import { getSymptoms } from '../../../../api/master-data-services/symptom';
import { BackButton } from '../../../../components/shared/BackButton';

export const SymptomPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
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
  } = useQuery('master-symptoms', () => getSymptoms(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    symptomId => {
      const symptom = res?.data.find(symptom => symptom.id === symptomId);
      setSelectedSymptom(symptom);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(symptom => {
        return {
          id: symptom.id,
          name: symptom.name,
        };
      }),
    [isSuccess, res?.data]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
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
    [handleEdit]
  );

  return (
    <>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <Box>
        <AddSymptomModal isOpen={isModalOpen} onClose={onModalClose} />
        <EditSymptomDrawer
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          selectedSymptom={selectedSymptom}
          setSelectedSymptom={setSelectedSymptom}
        />
        <BackButton to="/master" text="Back to Master List" />
        <Heading
          mb={{ base: '3', '2xl': '6' }}
          fontSize={{ base: '2xl', '2xl': '3xl' }}
        >
          Symptom
        </Heading>
        <PaginationTable
          columns={columns}
          data={data || []}
          skeletonCols={3}
          isLoading={isLoading}
          action={
            <Button onClick={onModalOpen} colorScheme="purple">
              Add New Symptom
            </Button>
          }
        />
      </Box>
    </>
  );
};
