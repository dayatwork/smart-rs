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
import { getInstitutionRoles } from '../../../../api/human-capital-services/role';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import { AddRoleModal } from '../../../../components/web-staff/institution-management/role';
import { BackButton } from '../../../../components/shared/BackButton';

export const RolePage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    data: resRole,
    isSuccess: isSuccessRole,
    isLoading: isLoadingRole,
    isFetching: isFetchingRole,
  } = useQuery(
    ['institution-roles', selectedInstitution],
    () => getInstitutionRoles(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const data = React.useMemo(
    () =>
      isSuccessRole &&
      resRole?.data?.map(role => {
        return {
          id: role.id,
          name: role.name,
          alias: role.alias,
        };
      }),
    [resRole?.data, isSuccessRole]
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
        Header: 'Alias',
        accessor: 'alias',
        Cell: ({ value }) => (value ? value : '-'),
      },
    ],
    []
  );

  return (
    <Box>
      {isFetchingRole && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddRoleModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />

      <BackButton
        to="/institution-management"
        text="Back to Institution Management List"
      />
      <Heading mb="6" fontSize="3xl">
        Role
      </Heading>
      {user?.role?.alias === 'super-admin' && (
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
          isLoading={isLoadingRole}
          skeletonCols={3}
          action={
            <Button onClick={onModalOpen} colorScheme="purple">
              Add New Role
            </Button>
          }
        />
      )}
    </Box>
  );
};
