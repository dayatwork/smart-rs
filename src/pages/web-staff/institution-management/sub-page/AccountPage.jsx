/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Spinner,
  Select,
  Text,
  Badge,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../contexts/authContext';
import { getAccounts } from '../../../../api/human-capital-services/account';
import { getInstitutions } from '../../../../api/institution-services/institution';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../components/shared/BackButton';

export const AccountPage = () => {
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
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery(
    ['accounts', selectedInstitution],
    () => getAccounts(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(account => {
        return {
          id: account.id,
          name: account.name,
          employee_number: account.employee_number,
          role: account.profession,
          status: account.status,
          fms: account.functional_medical_staff_id,
          email: account.email,
          phone_number: account.phone_number,
          register_date: account.register_date,
        };
      }),
    [res?.data, isSuccess]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value, row }) => (
          <Box>
            <Text mb="1">{value}</Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray.500">
              {row.original.email}
            </Text>
          </Box>
        ),
      },
      {
        Header: 'Employee No.',
        accessor: 'employee_number',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value === 'active') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
      },
      {
        Header: 'SMF',
        accessor: 'fms',
      },
      {
        Header: 'Phone',
        accessor: 'phone_number',
      },
      {
        Header: 'Register Date',
        accessor: 'register_date',
      },
    ],
    []
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <BackButton
        to="/institution-management"
        text="Back to Institution Management List"
      />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Account
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
          isLoading={isLoading}
          skeletonCols={8}
        />
      )}
    </Box>
  );
};
