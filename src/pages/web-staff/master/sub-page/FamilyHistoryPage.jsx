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
  AddFamilyHistoryModal,
  EditFamilyHistoryDrawer,
} from '../../../../components/web-staff/master/family-history';
import { getFamilyHistories } from '../../../../api/master-data-services/family-histories';
import { BackButton } from '../../../../components/shared/BackButton';

export const FamilyHistoryPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedFamilyHistory, setSelectedFamilyHistory] = useState(null);
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
  } = useQuery('master-family-histories', () => getFamilyHistories(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    (familyHistoryId) => {
      const familyHistory = res?.data.find(
        (familyHistory) => familyHistory.id === familyHistoryId,
      );
      setSelectedFamilyHistory(familyHistory);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data],
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map((allergy) => {
        return {
          id: allergy.id,
          type: allergy.type,
          name: allergy.name,
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
        <AddFamilyHistoryModal isOpen={isModalOpen} onClose={onModalClose} />
        <EditFamilyHistoryDrawer
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          selectedFamilyHistory={selectedFamilyHistory}
          setSelectedFamilyHistory={setSelectedFamilyHistory}
        />
        <BackButton to="/master" text="Back to Master List" />
        <Heading mb="6" fontSize="3xl">
          Family History
        </Heading>
        <PaginationTable
          columns={columns}
          data={data || []}
          skeletonCols={3}
          isLoading={isLoading}
          action={
            <Button onClick={onModalOpen} colorScheme="purple">
              Add New Family History
            </Button>
          }
        />
      </Box>
    </>
  );
};
