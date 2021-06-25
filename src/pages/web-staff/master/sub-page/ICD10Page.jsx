/* eslint-disable react/display-name */
import React, { useState, useCallback } from 'react';
import {
  Button,
  Heading,
  Spinner,
  useDisclosure,
  IconButton,
  HStack,
  Box,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { HiPencilAlt } from 'react-icons/hi';

import { getICD10 } from '../../../../api/master-data-services/icd10';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddICD10Modal,
  EditICD10Drawer,
} from '../../../../components/web-staff/master/icd-10';
import { BackButton } from '../../../../components/shared/BackButton';

export const ICD10Page = () => {
  const [cookies] = useCookies(['token']);
  const [selectedICD10, setSelectedICD10] = useState(null);

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
  } = useQuery('icd-10', () => getICD10(cookies));

  const handleEdit = useCallback(
    icd10Id => {
      const icd10 = res?.data.find(icd10 => icd10.id === icd10Id);
      setSelectedICD10(icd10);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(icd10 => {
        return {
          id: icd10.id,
          code: icd10.code,
          name: icd10.name,
          name_id: icd10.name_id,
        };
      }),
    [res?.data, isSuccess]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        // Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Code',
        accessor: 'code',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Name (ID)',
        accessor: 'name_id',
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
    [handleEdit]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddICD10Modal isOpen={isModalOpen} onClose={onModalClose} />
      <EditICD10Drawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedICD10={selectedICD10}
        setSelectedICD10={setSelectedICD10}
      />

      <BackButton to="/master" text="Back to Master List" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        ICD 10
      </Heading>
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={5}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New ICD 10
          </Button>
        }
      />
    </Box>
  );
};
