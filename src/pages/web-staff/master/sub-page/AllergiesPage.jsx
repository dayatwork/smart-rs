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
  AddAllergyModal,
  EditAllergyDrawer,
} from '../../../../components/web-staff/master/allergy';
import { getAllergies } from '../../../../api/master-data-services/allergies';
import { BackButton } from '../../../../components/shared/BackButton';

export const AllergiesPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedAllergy, setSelectedAllergy] = useState(null);
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
  } = useQuery('master-allergies', () => getAllergies(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    allergyId => {
      const allergy = res?.data.find(allergy => allergy.id === allergyId);
      setSelectedAllergy(allergy);
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
          type: allergy.type,
          name: allergy.name,
        };
      }),
    [isSuccess, res?.data]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        // isNumeric: true,
      },
      {
        Header: 'Type',
        accessor: 'type',
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
        <AddAllergyModal isOpen={isModalOpen} onClose={onModalClose} />
        <EditAllergyDrawer
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          selectedAllergy={selectedAllergy}
          setSelectedAllergy={setSelectedAllergy}
        />
        <BackButton to="/master" text="Back to Master List" />
        <Heading
          mb={{ base: '3', '2xl': '6' }}
          fontSize={{ base: '2xl', '2xl': '3xl' }}
        >
          Allergies
        </Heading>
        <PaginationTable
          columns={columns}
          data={data || []}
          skeletonCols={4}
          isLoading={isLoading}
          action={
            <Button onClick={onModalOpen} colorScheme="purple">
              Add New Allergy
            </Button>
          }
        />
      </Box>
    </>
  );
};
