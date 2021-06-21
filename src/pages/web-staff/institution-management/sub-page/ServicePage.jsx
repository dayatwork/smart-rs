/* eslint-disable react/display-name */
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Select,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import {
  getServiceTypes,
  getServices,
} from '../../../../api/institution-services/service';
import { getInstitutions } from '../../../../api/institution-services/institution';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddServiceModal,
  AddServiceTypeModal,
} from '../../../../components/web-staff/institution-management/service';
import { BackButton } from '../../../../components/shared/BackButton';

export const ServicePage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    '3f026d44-6b43-47ce-ba4b-4d0a8b174286',
  );

  const { data: dataInstitutions, isSuccess: isSuccessInstitutions } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity },
  );

  return (
    <Box>
      <BackButton
        to="/institution-management"
        text="Back to Institution Management List"
      />
      <Heading mb="6" fontSize="3xl">
        Service
      </Heading>
      <FormControl id="name" mb="4" maxW="xs">
        <FormLabel>Institution</FormLabel>
        <Select
          name="institution"
          value={selectedInstitution}
          onChange={(e) => setSelectedInstitution(e.target.value)}>
          <option value="">Select Institution</option>
          {isSuccessInstitutions &&
            dataInstitutions?.data?.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
        </Select>
      </FormControl>
      {selectedInstitution && (
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
              <ServiceType selectedInstitution={selectedInstitution} />
            </TabPanel>
            <TabPanel>
              <Service selectedInstitution={selectedInstitution} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

const ServiceType = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const {
    data: dataServiceTypes,
    isSuccess: isSuccessServiceTypes,
    isLoading: isLoadingServiceTypes,
    isFetching: isFetchingServiceTypes,
  } = useQuery(
    ['service-types', selectedInstitution],
    () => getServiceTypes(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) },
  );

  const data = React.useMemo(
    () =>
      isSuccessServiceTypes &&
      dataServiceTypes?.data?.map((type) => ({
        id: type.id,
        name: type.name,
        description: type.description,
      })),
    [dataServiceTypes?.data, isSuccessServiceTypes],
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
    ],
    [],
  );

  return (
    <>
      {isFetchingServiceTypes && (
        <Spinner top="10" right="12" position="absolute" colorScheme="purple" />
      )}
      <AddServiceTypeModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoadingServiceTypes}
        skeletonCols={3}
        action={
          <Button colorScheme="purple" onClick={onModalOpen}>
            Add New Service Type
          </Button>
        }
      />
    </>
  );
};

const Service = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataServices,
    isSuccess: isSuccessServices,
    isLoading: isLoadingServices,
    isFetching: isFetchingServices,
  } = useQuery(
    ['services', selectedInstitution],
    () => getServices(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
      staleTime: Infinity,
    },
  );

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const data = React.useMemo(
    () =>
      isSuccessServices &&
      dataServices?.data?.map((service) => ({
        id: service.id,
        type: service.service_type?.name,
        name: service.name,
        description: service.description,
      })),
    [dataServices?.data, isSuccessServices],
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Name',
        accessor: 'name',
        // Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }) => (value ? value : '-'),
      },
    ],
    [],
  );

  return (
    <>
      {isFetchingServices && (
        <Spinner top="10" right="12" position="absolute" colorScheme="purple" />
      )}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoadingServices}
        skeletonCols={4}
        action={
          <Button colorScheme="purple" onClick={onModalOpen}>
            Add New Service
          </Button>
        }
      />
    </>
  );
};
