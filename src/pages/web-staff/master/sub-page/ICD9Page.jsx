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

import { getICD9 } from '../../../../api/master-data-services/icd9';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddICD9Modal,
  EditICD9Drawer,
} from '../../../../components/web-staff/master/icd-9';
import { BackButton } from '../../../../components/shared/BackButton';

export const ICD9Page = () => {
  const [cookies] = useCookies(['token']);
  const [selectedICD9, setSelectedICD9] = useState(null);

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
  } = useQuery('icd-9', () => getICD9(cookies));

  const handleEdit = useCallback(
    icd9Id => {
      const icd9 = res?.data.find(icd9 => icd9.id === icd9Id);
      setSelectedICD9(icd9);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(icd9 => {
        return {
          id: icd9.id,
          code: icd9.code,
          name: icd9.name,
          name_id: icd9.name_id,
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

      <AddICD9Modal isOpen={isModalOpen} onClose={onModalClose} />
      <EditICD9Drawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedICD9={selectedICD9}
        setSelectedICD9={setSelectedICD9}
      />

      <BackButton to="/master" text="Back to Master List" />

      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        ICD 9
      </Heading>
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={5}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New ICD 9
          </Button>
        }
      />
    </Box>
  );
};
