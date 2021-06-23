/* eslint-disable react/display-name */
import React from 'react';
import { Box, Button, Heading, Spinner, useDisclosure } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import {
  getRoles,
  getDefaultAccessControl,
  getRoleById,
} from '../../../../api/user-services/role-management';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddRoleModal,
  AssignAccessModal,
} from '../../../../components/web-staff/user-management/role';
import { BackButton } from '../../../../components/shared/BackButton';
import { SuperAdminComponent } from '../../../../access-control';

export const RolePage = () => {
  const [cookies] = useCookies(['token']);

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

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
  } = useQuery('user-roles', () => getRoles(cookies));

  const {
    data: resDefaultAccess,
    isSuccess: isSuccessDefaultAccess,
    isLoading: isLoadingDefaultAccess,
    isFetching: isFetchingDefaultAccess,
  } = useQuery('default-access-control', () =>
    getDefaultAccessControl(cookies)
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(role => {
        return {
          id: role.id,
          name: role.name,
          alias: role.alias,
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
        Header: 'Alias',
        accessor: 'alias',
        Cell: ({ value }) => (value ? value : '-'),
      },
    ],
    []
  );

  const dataDefaultAccess = React.useMemo(
    () =>
      isSuccessDefaultAccess &&
      resDefaultAccess?.data?.map(access => {
        return {
          id: access.id,
          role: access.role_id,
          menu: access.resource,
          route: access.attribute,
        };
      }),
    [resDefaultAccess?.data, isSuccessDefaultAccess]
  );

  const columnsDefaultAccess = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}</Box>,
      },
      {
        Header: 'Role',
        accessor: 'role',
        Cell: ({ value }) => {
          const { data: resRole } = useQuery(
            ['user-roles', value],
            () => getRoleById(cookies, value),
            { enabled: Boolean(value) }
          );
          return resRole?.data?.name || '-';
        },
      },
      {
        Header: 'Menu',
        accessor: 'menu',
      },
      {
        Header: 'Route',
        accessor: 'route',
      },
    ],
    [cookies]
  );

  return (
    <Box>
      {isFetching && isFetchingDefaultAccess && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddRoleModal isOpen={isModalOpen} onClose={onModalClose} />
      <AssignAccessModal
        isOpen={isAssignModalOpen}
        onClose={onAssignModalClose}
      />

      <BackButton to="/user-management" text="Back to User Management List" />
      <Heading mb="6" fontSize="3xl">
        Roles
      </Heading>
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={3}
        action={
          <SuperAdminComponent>
            <Button onClick={onModalOpen} colorScheme="purple">
              Add New Role
            </Button>
          </SuperAdminComponent>
        }
      />

      <Box>
        <Heading fontSize="xl" mb="2">
          Default Access Control
        </Heading>
        <PaginationTable
          columns={columnsDefaultAccess}
          data={dataDefaultAccess || []}
          isLoading={isLoadingDefaultAccess}
          skeletonCols={4}
          action={
            <SuperAdminComponent>
              <Button colorScheme="green" onClick={onAssignModalOpen}>
                Assign Access Control
              </Button>
            </SuperAdminComponent>
          }
        />
      </Box>
    </Box>
  );
};
