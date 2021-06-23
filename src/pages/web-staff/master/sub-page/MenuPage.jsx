/* eslint-disable react/display-name */
import React, { useState } from 'react';
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
import { HiPencilAlt } from 'react-icons/hi';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../components/shared/BackButton';
import {
  AddMenuModal,
  EditMenuDrawer,
} from '../../../../components/web-staff/master/menu';
import {
  getMenus,
  getMenuById,
} from '../../../../api/application-services/menu';
import { getApplicationById } from '../../../../api/application-services/application';

export const MenuPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedMenu, setSelectedMenu] = useState(null);

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
    data: resMenu,
    isLoading,
    isFetching,
  } = useQuery('master-menu', () => getMenus(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = React.useCallback(
    menuId => {
      const app = resMenu?.data.find(menu => menu.id === menuId);
      setSelectedMenu(app);
      onDrawerOpen();
    },
    [onDrawerOpen, resMenu?.data]
  );

  const data = React.useMemo(
    () =>
      resMenu?.data?.map(menu => {
        return {
          id: menu.id,
          app: menu.app_id,
          name: menu.name,
          parent: menu.parent_id,
          description: menu.description,
          status: menu.status,
        };
      }),
    [resMenu?.data]
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
            { enabled: Boolean(value), staleTime: Infinity }
          );
          if (isLoading) return <Skeleton height="40px" />;
          return resApp?.data?.name || '-';
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Parent Menu',
        accessor: 'parent',
        Cell: ({ value }) => {
          const { data: resMenu } = useQuery(
            ['menu', value],
            () => getMenuById(cookies, value),
            { enabled: Boolean(value), staleTime: Infinity }
          );
          return resMenu?.data?.name || '-';
        },
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
        Cell: ({ row }) => (
          <HStack>
            <IconButton
              aria-label="Edit"
              colorScheme="blackAlpha"
              icon={<HiPencilAlt />}
              onClick={() => handleEdit(row.original.id)}
            />
          </HStack>
        ),
      },
    ],
    [cookies, handleEdit]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <AddMenuModal isOpen={isModalOpen} onClose={onModalClose} />
      <EditMenuDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedMenu={selectedMenu}
      />
      <BackButton to="/master" text="Back to Master List" />

      <Heading mb="6" fontSize="3xl">
        Menu
      </Heading>
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={7}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Menu
          </Button>
        }
      />
    </Box>
  );
};
