/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Button,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../../../api/institution-services/institution';
import { getEmployeeSchedules } from '../../../../../../../api/human-capital-services/schedule';
import PaginationTable from '../../../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../../../components/shared/BackButton';
import { CreateStaffScheduleModal } from '../../../../../../../components/web-staff/division/human-capital/staff-schedule';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../../access-control';

export const StaffScheduleListPage = () => {
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
  } = useQuery('employee-schedules', () => getEmployeeSchedules(cookies));

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(schedule => {
        return {
          id: schedule.id,
          institution_id: schedule.institution_id,
          employee_id: schedule.employee_id,
          schedule_id: schedule.schedule_id,
          employee_name: schedule.employee.name,
          schedule_name: schedule.schedule.name,
          start_date: schedule.start_date,
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
        Header: 'Employee Name',
        accessor: 'employee_name',
      },
      {
        Header: 'Schedule Name',
        accessor: 'schedule_name',
      },
      {
        Header: 'Start Date',
        accessor: 'start_date',
        Cell: ({ value }) =>
          value
            ? new Date(value).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '-',
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
    // [onEditOpen, onDetailOpen, onChangeStatusOpen]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <CreateStaffScheduleModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />

      <BackButton to="/division/human-capital" text="Back to SDM" />
      <Heading mb="6" fontSize="3xl">
        Staff Schedule List
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
          skeletonCols={5}
          columns={columns}
          data={data || []}
          isLoading={isLoading}
          action={
            <PrivateComponent permission={Permissions.createStaffSchedule}>
              <Button colorScheme="purple" onClick={onModalOpen}>
                Create Staff Schedule
              </Button>
            </PrivateComponent>
          }
        />
      )}
    </Box>
  );
};
