/* eslint-disable react/display-name */
import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Heading,
  Spinner,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { HiPencilAlt } from 'react-icons/hi';

import {
  getServiceTypes,
  getServices,
} from '../../../../api/master-data-services/service';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddServiceTypeModal,
  EditServiceTypeDrawer,
  AddServiceModal,
  EditServiceDrawer,
} from '../../../../components/web-staff/master/service';
import { BackButton } from '../../../../components/shared/BackButton';

export const ServicePage = () => {
  return (
    <Box>
      <BackButton to="/master" text="Back to Master List" />

      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Service
      </Heading>
      <Tabs size="lg" colorScheme="purple">
        <TabList>
          <Tab fontSize="2xl" fontWeight="semibold">
            Service Type
          </Tab>
          <Tab fontSize="2xl" fontWeight="semibold">
            Service
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ServiceType />
          </TabPanel>
          <TabPanel>
            <Service />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

// ================================
// ========= Service Type =========
// ================================
const ServiceType = () => {
  const [cookies] = useCookies(['token']);
  const [selectedType, setSelectedType] = useState(null);

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
  } = useQuery('master-service-types', () => getServiceTypes(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    typeId => {
      const type = res?.data.find(type => type.id === typeId);
      setSelectedType(type);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(type => {
        return {
          id: type.id,
          name: type.name,
          description: type.description,
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
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }) => (value ? value : '-'),
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
    [handleEdit]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddServiceTypeModal isOpen={isModalOpen} onClose={onModalClose} />
      <EditServiceTypeDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={4}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Service Type
          </Button>
        }
      />
    </Box>
  );
};

// ================================
// ============ Service============
// ================================
const Service = () => {
  const [cookies] = useCookies(['token']);
  const [selectedService, setSelectedService] = useState(null);

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
  } = useQuery('master-services', () => getServices(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    serviceId => {
      const service = res?.data.find(service => service.id === serviceId);
      setSelectedService(service);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(service => {
        return {
          id: service?.id,
          name: service?.name,
          description: service?.description,
          service_type_id: service?.service_type_id,
          service_type_name: service?.service_type?.name,
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
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Service Type',
        accessor: 'service_type_name',
        Cell: ({ value }) => (value ? value : '-'),
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
    [handleEdit]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddServiceModal isOpen={isModalOpen} onClose={onModalClose} />
      <EditServiceDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
      />

      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={5}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Service
          </Button>
        }
      />
    </Box>
  );
};
