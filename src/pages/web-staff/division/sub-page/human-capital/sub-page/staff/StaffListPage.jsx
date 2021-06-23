/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../../../api/institution-services/institution';
import { getRegisteredStaff } from '../../../../../../../api/human-capital-services/employee';
import PaginationTable from '../../../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../../../components/shared/BackButton';

export const StaffListPage = () => {
  const { employeeDetail } = useContext(AuthContext);
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
    data: res,
    isFetching,
    isSuccess,
    isLoading,
  } = useQuery(
    ['employees', selectedInstitution],
    () => getRegisteredStaff(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(account => {
        return {
          id: account.id,
          name: account.name,
          employee_number: account.employee_number,
          profession: account.profession,
          status: account.status,
          fms: account.functional_medical_staff_id,
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
      },
      {
        Header: 'Employee No.',
        accessor: 'employee_number',
      },
      {
        Header: 'Profession',
        accessor: 'profession',
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
        Header: 'Action',
        accessor: 'userId',
        Cell: ({ value }) => (
          <VStack align="flex-start">
            <Button
              variant="link"
              size="sm"
              colorScheme="blue"
              // onClick={onDetailOpen}
            >
              View Detail
            </Button>
            <Button
              variant="link"
              size="sm"
              colorScheme="green"
              // onClick={onEditOpen}
            >
              Edit Data
            </Button>
            <Button
              variant="link"
              size="sm"
              colorScheme="orange"
              // onClick={onChangeStatusOpen}
            >
              Change Status
            </Button>
          </VStack>
        ),
      },
    ],
    []
    // [onEditOpen, onDetailOpen, onChangeStatusOpen]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <BackButton to="/division/human-capital" text="Back to SDM" />
      <Heading mb="6" fontSize="3xl">
        Staff List
      </Heading>

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

      {selectedInstitution && (
        <PaginationTable
          skeletonCols={7}
          columns={columns}
          data={data || []}
          isLoading={isLoading}
          action={
            <HStack>
              <Button
                as={Link}
                to="/division/human-capital/staff/assign"
                colorScheme="purple"
              >
                Assign New Staff
              </Button>
              <Button
                as={Link}
                to="/division/human-capital/staff/create"
                colorScheme="purple"
              >
                Add New Staff
              </Button>
            </HStack>
          }
        />
      )}
    </Box>
  );
};
