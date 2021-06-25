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
  AddSocialHistoryModal,
  EditSocialHistoryDrawer,
} from '../../../../components/web-staff/master/social-history';
import { getSocialHistories } from '../../../../api/master-data-services/social-histories';
import { BackButton } from '../../../../components/shared/BackButton';

export const SocialHistoryPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedSocialHistory, setSelectedSocialHistory] = useState(null);
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
  } = useQuery('master-social-histories', () => getSocialHistories(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    socialHistoryId => {
      const socialHistory = res?.data.find(
        socialHistory => socialHistory.id === socialHistoryId
      );
      setSelectedSocialHistory(socialHistory);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(allergy => {
        return {
          id: allergy.id,
          name: allergy.name,
          default_value: allergy.default_value,
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
        Header: 'Default Value',
        accessor: 'default_value',
        Cell: ({ value }) => (
          <Box as="span" maxW="xl">
            {value.join(', ')}
          </Box>
        ),
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
        <AddSocialHistoryModal isOpen={isModalOpen} onClose={onModalClose} />
        <EditSocialHistoryDrawer
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          selectedSocialHistory={selectedSocialHistory}
          setSelectedSocialHistory={setSelectedSocialHistory}
        />
        <BackButton to="/master" text="Back to Master List" />
        <Heading
          mb={{ base: '3', '2xl': '6' }}
          fontSize={{ base: '2xl', '2xl': '3xl' }}
        >
          Social History
        </Heading>
        <PaginationTable
          columns={columns}
          data={data || []}
          skeletonCols={4}
          isLoading={isLoading}
          action={
            <Button onClick={onModalOpen} colorScheme="purple">
              Add New Social History
            </Button>
          }
        />
      </Box>
    </>
  );
};
