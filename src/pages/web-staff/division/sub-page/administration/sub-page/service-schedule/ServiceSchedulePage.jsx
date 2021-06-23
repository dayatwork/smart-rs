/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getInstitutions } from '../../../../../../../api/institution-services/institution';

// import { ListServiceSchedule } from './ListServiceSchedule';
// import { AddServiceSchedule } from './AddServiceSchedule';
import { AuthContext } from '../../../../../../../contexts/authContext';
import { getServiceSchedules } from '../../../../../../../api/institution-services/service';
import PaginationTable from '../../../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../../../components/shared/BackButton';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../../access-control';

export const ServiceSchedulePage = () => {
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
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery(
    ['service-schedule', selectedInstitution],
    () => getServiceSchedules(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(servSchedule => {
        return {
          id: servSchedule.id,
          service_id: servSchedule.service_id,
          service_name: servSchedule.service.name,
          employee_id: servSchedule.employee_id,
          employee_name: servSchedule.employee.name,
          schedule: servSchedule.schedule,
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
        Header: 'Nama Layanan',
        accessor: 'service_name',
      },
      {
        Header: 'DPJP',
        accessor: 'employee_name',
      },

      {
        Header: 'Action',
        // accessor: "userId",
        Cell: ({ row }) => (
          <VStack align="flex-start">
            <PrivateComponent
              permission={Permissions['read-detailServiceSchedule']}
            >
              <Button
                as={Link}
                to={`/division/administration/service-schedule/${row.original.id}`}
                variant="link"
                size="sm"
                colorScheme="blue"
              >
                View Detail
              </Button>
            </PrivateComponent>
            <Button variant="link" size="sm" colorScheme="green">
              Edit Data
            </Button>
            <Button variant="link" size="sm" colorScheme="orange">
              Change Status
            </Button>
          </VStack>
        ),
      },
    ],
    []
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <BackButton to="/division/administration" text="Back to Administration" />
      <Heading mb="6" fontSize="3xl">
        Jadwal Layanan
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
          skeletonCols={4}
          columns={columns}
          data={data || []}
          isLoading={isLoading}
          action={
            <PrivateComponent permission={Permissions.createServiceSchedule}>
              <Button
                as={Link}
                to="/division/administration/service-schedule/create"
                colorScheme="purple"
              >
                Create New Schedule
              </Button>
            </PrivateComponent>
          }
        />
      )}
    </Box>
  );
};
