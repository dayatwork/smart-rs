/* eslint-disable react/display-name */
import React, { useState, useCallback } from 'react';
import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { HiPencilAlt } from 'react-icons/hi';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../components/shared/BackButton';
import {
  AddApplicationModal,
  EditApplicationDrawer,
} from '../../../../components/web-staff/master/application';
import { getApplications } from '../../../../api/application-services/application';

export const ApplicationPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedApp, setSelectedApp] = useState(null);

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
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery('master-application', () => getApplications(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    (appId) => {
      const app = res?.data.find((app) => app.id === appId);
      setSelectedApp(app);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data],
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map((app) => {
        return {
          id: app.id,
          name: app.name,
          platform: app.platform,
          description: app.description,
        };
      }),
    [res?.data, isSuccess],
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
      },
      {
        Header: 'Platform',
        accessor: 'platform',
        Cell: ({ value }) => {
          return (
            <HStack>
              {value.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </HStack>
          );
        },
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          return (
            <HStack>
              <IconButton
                aria-label="Edit"
                colorScheme="blackAlpha"
                icon={<HiPencilAlt />}
                onClick={() => handleEdit(row.original.id)}
              />
            </HStack>
          );
        },
      },
    ],
    [handleEdit],
  );

  return (
    <Box>
      {isFetching && <Spinner top="8" right="12" position="absolute" color="purple" />}
      <AddApplicationModal isOpen={isModalOpen} onClose={onModalClose} />
      <EditApplicationDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedApp={selectedApp}
        setSelectedApp={setSelectedApp}
      />
      <BackButton to="/master" text="Back to Master List" />

      <Heading mb="6" fontSize="3xl">
        Application
      </Heading>
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Application
          </Button>
        }
      />
    </Box>
  );
};
