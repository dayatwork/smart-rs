/* eslint-disable react/display-name */
import React, { useState, useCallback } from 'react';
import { Box, Button, Heading, Spinner, useDisclosure } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getUsers } from '../../../../api/user-services/user-management';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import { AssignUserModal } from '../../../../components/web-staff/user-management/users';
import { BackButton } from '../../../../components/shared/BackButton';
import { SuperAdminComponent } from '../../../../access-control';

export const UsersPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    onOpen: onAssignModalOpen,
    isOpen: isAssignModalOpen,
    onClose: onAssignModalClose,
  } = useDisclosure();

  const {
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery('users', () => getUsers(cookies));

  const handleAssignUserRole = useCallback(
    user => {
      setSelectedUser(user);
      onAssignModalOpen();
    },
    [onAssignModalOpen]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(user => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone_number,
          status: user.status,
          registrationDate: user.registration_date,
          role: user?.role?.name || '',
          institution: user?.institution[0]?.name || '',
          institution_id: user?.institution_id,
          role_id: user?.role_id,
        };
      }),
    [res?.data, isSuccess]
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
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Email',
        accessor: 'email',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Phone',
        accessor: 'phone',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Created',
        accessor: 'registrationDate',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Institution',
        accessor: 'institution',
      },
      {
        Header: 'Assign',
        Cell: ({ row }) => (
          <SuperAdminComponent>
            <Button
              colorScheme="purple"
              size="sm"
              onClick={() => handleAssignUserRole(row.original)}
            >
              Assign
            </Button>
          </SuperAdminComponent>
        ),
      },
    ],
    [handleAssignUserRole]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AssignUserModal
        isOpen={isAssignModalOpen}
        onClose={onAssignModalClose}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <BackButton to="/user-management" text="Back to User Management List" />
      <Heading mb="6" fontSize="3xl">
        Users
      </Heading>
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={9}
      />
    </Box>
  );
};
