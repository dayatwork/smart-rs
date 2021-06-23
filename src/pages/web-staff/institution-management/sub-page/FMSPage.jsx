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
import { getFMS } from '../../../../api/institution-services/fms';
import { getInstitutions } from '../../../../api/institution-services/institution';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import { AddFmsModal } from '../../../../components/web-staff/institution-management/fms';
import { BackButton } from '../../../../components/shared/BackButton';

export const FMSPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [cookies] = useCookies(['token']);

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
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery(
    ['fms', selectedInstitution],
    () => getFMS(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
      staleTime: Infinity,
    }
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(type => {
        return {
          id: type.id,
          name: type.name,
          description: type.description,
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
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }) => (value ? value : '-'),
      },
    ],
    []
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddFmsModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />

      <BackButton
        to="/institution-management"
        text="Back to Institution Management List"
      />
      <Heading mb="6" fontSize="3xl">
        SMF
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
          skeletonCols={3}
          action={
            <Button onClick={onModalOpen} colorScheme="purple">
              Add New SMF
            </Button>
          }
        />
      )}
    </Box>
  );
};
