/* eslint-disable react/display-name */
import React, { useCallback } from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { HiPencilAlt, HiTrash } from 'react-icons/hi';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getApplicationById } from '../../../../api/application-services/application';
import { getMenuById } from '../../../../api/application-services/menu';
import { getRoutes } from '../../../../api/application-services/route';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddRouteModal,
  EditRouteDrawer,
  DeleteRouteAlert,
} from '../../../../components/web-staff/master/route';
import { BackButton } from '../../../../components/shared/BackButton';

export const RoutePage = () => {
  const [cookies] = useCookies(['token']);

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const {
    onOpen: onDrawerOpen,
    isOpen: isDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const {
    onOpen: onAlertOpen,
    isOpen: isAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const {
    data: resRoute,
    isFetching,
    isLoading,
  } = useQuery('master-routes', () => getRoutes(cookies), { staleTime: Infinity });

  const handleEdit = useCallback(() => {
    onDrawerOpen();
  }, [onDrawerOpen]);

  const handleDelete = useCallback(() => {
    onAlertOpen();
  }, [onAlertOpen]);

  const data = React.useMemo(
    () =>
      resRoute?.data?.map((route) => {
        return {
          id: route.id,
          app: route.app_id,
          menu: route.menu_id,
          name: route.name,
          alias: route.alias,
          description: route.description,
          status: route.status,
        };
      }),
    [resRoute?.data],
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}</Box>,
      },
      {
        Header: 'App',
        accessor: 'app',
        Cell: ({ value }) => {
          const { data: resApp, isLoading } = useQuery(
            ['app', value],
            () => getApplicationById(cookies, value),
            { enabled: Boolean(value) },
          );
          if (isLoading) return <Skeleton height="40px" />;
          return resApp?.data?.name || '-';
        },
      },
      {
        Header: 'Menu',
        accessor: 'menu',
        Cell: ({ value }) => {
          const { data: resMenu, isLoading } = useQuery(
            ['menu', value],
            () => getMenuById(cookies, value),
            { enabled: Boolean(value) },
          );
          if (isLoading) return <Skeleton height="40px" />;
          return resMenu?.data?.name || '-';
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Alias',
        accessor: 'alias',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Action',
        Cell: ({ value }) => (
          <HStack>
            <IconButton
              aria-label="Edit"
              colorScheme="blackAlpha"
              icon={<HiPencilAlt />}
              onClick={() => handleEdit(value)}
            />
            <IconButton
              aria-label="Delete"
              colorScheme="red"
              icon={<HiTrash />}
              onClick={() => handleDelete(value)}
            />
          </HStack>
        ),
      },
    ],
    [handleEdit, handleDelete, cookies],
  );

  return (
    <Box>
      {isFetching && <Spinner top="8" right="12" position="absolute" color="purple" />}
      <AddRouteModal isOpen={isModalOpen} onClose={onModalClose} />
      <EditRouteDrawer isOpen={isDrawerOpen} onClose={onDrawerClose} />
      <DeleteRouteAlert isOpen={isAlertOpen} onClose={onAlertClose} />
      <BackButton to="/master" text="Back to Master List" />
      <Heading mb="6" fontSize="3xl">
        Route
      </Heading>
      <PaginationTable
        skeletonCols={8}
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Route
          </Button>
        }
      />
    </Box>
  );
};
