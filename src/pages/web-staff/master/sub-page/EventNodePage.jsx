/* eslint-disable react/display-name */
import React, { useCallback, useState } from 'react';
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

import { getApplicationById } from '../../../../api/application-services/application';
import { getEventNodes } from '../../../../api/application-services/event-node';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddEventNodeModal,
  EditEventNodeDrawer,
} from '../../../../components/web-staff/master/event-node';
import { BackButton } from '../../../../components/shared/BackButton';

export const EventNodePage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedEventNode, setSelectedEventNode] = useState(false);

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
    data: resEventNode,
    isFetching,
    isLoading,
  } = useQuery('master-event-nodes', () => getEventNodes(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    eventId => {
      const event = resEventNode?.data.find(event => event.id === eventId);
      setSelectedEventNode(event);
      onDrawerOpen();
    },
    [resEventNode?.data, onDrawerOpen]
  );

  const data = React.useMemo(
    () =>
      resEventNode?.data?.map(eventNode => {
        return {
          id: eventNode.id,
          app: eventNode.app_id,
          name: eventNode.name,
          description: eventNode.description,
          path: eventNode.path,
        };
      }),
    [resEventNode?.data]
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
            { enabled: Boolean(value) }
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
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Path',
        accessor: 'path',
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
    [handleEdit, cookies]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <AddEventNodeModal isOpen={isModalOpen} onClose={onModalClose} />
      <EditEventNodeDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedEventNode={selectedEventNode}
      />

      <BackButton to="/master" text="Back to Master List" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Event Node
      </Heading>
      <PaginationTable
        skeletonCols={6}
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Event Node
          </Button>
        }
      />
    </Box>
  );
};
