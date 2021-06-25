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
  AddSoapObjectiveModal,
  EditSoapObjectiveDrawer,
} from '../../../../components/web-staff/master/soap-objective';
import { getSoapObjectiveTemplates } from '../../../../api/master-data-services/soap-objective';
import { BackButton } from '../../../../components/shared/BackButton';

export const SoapObjectivePage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedSoapObjectiveTemplate, setSelectedSoapObjectiveTemplate] =
    useState(null);
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
  } = useQuery(
    'soap-objective-templates',
    () => getSoapObjectiveTemplates(cookies),
    {
      staleTime: Infinity,
    }
  );

  const handleEdit = useCallback(
    objectiveId => {
      const objective = res?.data.find(
        objective => objective.id === objectiveId
      );
      setSelectedSoapObjectiveTemplate(objective);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(objective => {
        return {
          id: objective.id,
          name: objective.name,
          default_value: objective.default_value,
        };
      }),
    [res?.data, isSuccess]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        // isNumeric: true,
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Default Value',
        accessor: 'default_value',
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
        <AddSoapObjectiveModal isOpen={isModalOpen} onClose={onModalClose} />
        <EditSoapObjectiveDrawer
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          selectedSoapObjectiveTemplate={selectedSoapObjectiveTemplate}
          setSelectedSoapObjectiveTemplate={setSelectedSoapObjectiveTemplate}
        />
        <BackButton to="/master" text="Back to Master List" />
        <Heading
          mb={{ base: '3', '2xl': '6' }}
          fontSize={{ base: '2xl', '2xl': '3xl' }}
        >
          SOAP Objective
        </Heading>
        <PaginationTable
          columns={columns}
          data={data || []}
          skeletonCols={4}
          isLoading={isLoading}
          action={
            <Button onClick={onModalOpen} colorScheme="purple">
              Add New SOAP Objective
            </Button>
          }
        />
      </Box>
    </>
  );
};
