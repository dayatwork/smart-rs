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
  AddMedicalHistoryModal,
  EditMedicalHistoryDrawer,
} from '../../../../components/web-staff/master/medical-history';
import { getMedicalHistories } from '../../../../api/master-data-services/medical-histories';
import { BackButton } from '../../../../components/shared/BackButton';

export const MedicalHistoryPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState(null);
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
  } = useQuery('master-medical-histories', () => getMedicalHistories(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    (medicalHistoryId) => {
      const medicalHistory = res?.data.find(
        (medicalHistory) => medicalHistory.id === medicalHistoryId,
      );
      setSelectedMedicalHistory(medicalHistory);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data],
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map((medicalHistory) => {
        return {
          id: medicalHistory.id,
          name: medicalHistory.name,
        };
      }),
    [isSuccess, res?.data],
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
    [handleEdit],
  );

  return (
    <>
      {isFetching && <Spinner top="8" right="12" position="absolute" color="purple" />}
      <Box>
        <AddMedicalHistoryModal isOpen={isModalOpen} onClose={onModalClose} />
        <EditMedicalHistoryDrawer
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          selectedMedicalHistory={selectedMedicalHistory}
          setSelectedMedicalHistory={setSelectedMedicalHistory}
        />
        <BackButton to="/master" text="Back to Master List" />
        <Heading mb="6" fontSize="3xl">
          Medical History
        </Heading>
        <PaginationTable
          columns={columns}
          data={data || []}
          skeletonCols={3}
          isLoading={isLoading}
          action={
            <Button onClick={onModalOpen} colorScheme="purple">
              Add New Medical History
            </Button>
          }
        />
      </Box>
    </>
  );
};
