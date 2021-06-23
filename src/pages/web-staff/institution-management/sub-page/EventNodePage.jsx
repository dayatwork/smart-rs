/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Spinner,
  useDisclosure,
  Select,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../contexts/authContext';
import { getInstitutions } from '../../../../api/institution-services/institution';
import { getEventNodes } from '../../../../api/institution-services/event-node';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import { AddEventNodeModal } from '../../../../components/web-staff/institution-management/event-node';
import { BackButton } from '../../../../components/shared/BackButton';

export const EventNodePage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const {
    data: resEventNode,
    isFetching,
    isLoading,
  } = useQuery(
    ['event-nodes', selectedInstitution],
    () => getEventNodes(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
      staleTime: Infinity,
    }
  );

  const data = React.useMemo(
    () =>
      resEventNode?.data?.map(eventNode => {
        return {
          id: eventNode.id,
          name: eventNode.name,
          description: eventNode.description,
          path: eventNode.path,
        };
      }),
    [resEventNode?.data]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}</Box>,
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Path',
        accessor: 'path',
      },
    ],
    []
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddEventNodeModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />

      <BackButton
        to="/institution-management"
        text="Back to Institution Management List"
      />
      <Heading mb="6" fontSize="3xl">
        Event Node
      </Heading>
      {user?.role?.alias && (
        <FormControl id="name" mb="4" maxW="xs">
          <FormLabel>Institution</FormLabel>
          <Select
            name="institution"
            value={selectedInstitution}
            onChange={e => setSelectedInstitution(e.target.value)}
          >
            <option value="">Select Institution</option>
            {isSuccessInstitution &&
              resInstitution?.data?.map(institution => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
          </Select>
        </FormControl>
      )}
      {selectedInstitution && (
        <PaginationTable
          columns={columns}
          data={data || []}
          isLoading={isLoading}
          skeletonCols={4}
          action={
            <Button onClick={onModalOpen} colorScheme="purple">
              Add New Event Node
            </Button>
          }
        />
      )}
    </Box>
  );
};
