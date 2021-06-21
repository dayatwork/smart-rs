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

import { getProfessions } from '../../../../api/master-data-services/profession';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddProfessionModal,
  EditProfessionDrawer,
} from '../../../../components/web-staff/master/profession';
import { BackButton } from '../../../../components/shared/BackButton';

export const ProfessionPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedProfession, setSelectedProfession] = useState(null);

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
  } = useQuery('master-professions', () => getProfessions(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    (professionId) => {
      const profession = res?.data.find((profession) => profession.id === professionId);
      setSelectedProfession(profession);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data],
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map((icd10) => {
        return {
          id: icd10.id,
          name: icd10.name,
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

      <AddProfessionModal isOpen={isModalOpen} onClose={onModalClose} />
      <EditProfessionDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedProfession={selectedProfession}
        setSelectedProfession={setSelectedProfession}
      />

      <BackButton to="/master" text="Back to Master List" />

      <Heading mb="6" fontSize="3xl">
        Profession
      </Heading>
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={3}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Profession
          </Button>
        }
      />
    </Box>
  );
};
