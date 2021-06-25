/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Flex,
  Button,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../../../api/institution-services/institution';
import { getSchedules } from '../../../../../../../api/human-capital-services/schedule';
import PaginationTable from '../../../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../../../components/shared/BackButton';
import { CreateScheduleModal } from '../../../../../../../components/web-staff/division/human-capital/schedule';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../../access-control';

export const ScheduleListPage = () => {
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
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery('schedules', () => getSchedules(cookies), {
    staleTime: Infinity,
  });

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(schedule => {
        return {
          id: schedule.id,
          name: schedule.name,
          schedule_details: schedule.schedule_details,
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
      },
      {
        Header: 'Schedule',
        accessor: 'schedule_details',
        Cell: ({ value }) => (
          <Box>
            {value.map(v => (
              <Description
                key={v.id}
                title={v.days.join(', ')}
                value={`${v.start_time} - ${v.end_time}`}
              />
            ))}
          </Box>
        ),
      },
      {
        Header: 'Detail',
        Cell: () => (
          <Button variant="link" colorScheme="purple">
            Detail
          </Button>
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

      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />

      <BackButton to="/division/human-capital" text="Back to SDM" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Schedule List
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
            <PrivateComponent permission={Permissions.createSchedule}>
              <Button colorScheme="purple" onClick={onModalOpen}>
                Create Schedule
              </Button>
            </PrivateComponent>
          }
        />
      )}
    </Box>
  );
};

const Description = ({ title, value, ...props }) => {
  return (
    <Flex as="dl" direction={{ base: 'column', sm: 'row' }} py="1">
      <Box as="dt" flexBasis="40%" fontWeight="semibold" color="gray.600">
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
