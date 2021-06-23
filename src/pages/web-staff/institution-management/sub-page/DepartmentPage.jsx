/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
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
  Badge,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { AuthContext } from '../../../../contexts/authContext';
import {
  getDepartmentTypes,
  getDepartments,
} from '../../../../api/institution-services/department';
import { getInstitutions } from '../../../../api/institution-services/institution';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddDepartmentModal,
  AddDepartmentTypeModal,
} from '../../../../components/web-staff/institution-management/department';
import { BackButton } from '../../../../components/shared/BackButton';
import { PrivateComponent, Permissions } from '../../../../access-control';

export const DepartmentPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );

  const { data: dataInstitutions, isSuccess: isSuccessInstitutions } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  return (
    <Box>
      <BackButton
        to="/institution-management"
        text="Back to Institution Management List"
      />
      <Heading mb="6" fontSize="3xl">
        Department
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
            {isSuccessInstitutions &&
              dataInstitutions?.data?.map(institution => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
          </Select>
        </FormControl>
      )}
      {selectedInstitution && (
        <Tabs size="lg" colorScheme="purple">
          <TabList>
            <PrivateComponent permission={Permissions.indexDepartmentType}>
              <Tab fontSize="2xl" fontWeight="semibold">
                Department Type
              </Tab>
            </PrivateComponent>
            <PrivateComponent
              permission={Permissions.indexInstitutionDepartment}
            >
              <Tab fontSize="2xl" fontWeight="semibold">
                Department
              </Tab>
            </PrivateComponent>
          </TabList>

          <TabPanels>
            <TabPanel>
              <PrivateComponent permission={Permissions.indexDepartmentType}>
                <DepartmentType selectedInstitution={selectedInstitution} />
              </PrivateComponent>
            </TabPanel>
            <TabPanel>
              <PrivateComponent
                permission={Permissions.indexInstitutionDepartment}
              >
                <Department selectedInstitution={selectedInstitution} />
              </PrivateComponent>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

const DepartmentType = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const {
    data: dataDepartmentTypes,
    isSuccess: isSuccessDepartmentTypes,
    isLoading: isLoadingDepartmentTypes,
    isFetching: isFetchingDepartmentTypes,
  } = useQuery(
    ['department-types', selectedInstitution],
    () => getDepartmentTypes(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const data = React.useMemo(
    () =>
      isSuccessDepartmentTypes &&
      dataDepartmentTypes?.data?.map(type => ({
        id: type.id,
        name: type.name,
        description: type.description,
      })),
    [dataDepartmentTypes?.data, isSuccessDepartmentTypes]
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
        Header: 'Details',
        Cell: () => (
          <Button variant="link" colorScheme="purple">
            Details
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <>
      {isFetchingDepartmentTypes && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <AddDepartmentTypeModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />

      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoadingDepartmentTypes}
        skeletonCols={4}
        action={
          <PrivateComponent permission={Permissions.createDepartmentType}>
            <Button colorScheme="purple" onClick={onModalOpen}>
              Add New Deparment Type
            </Button>
          </PrivateComponent>
        }
      />
    </>
  );
};

const Department = ({ selectedInstitution }) => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataDepartments,
    isSuccess: isSuccessDepartments,
    isLoading: isLoadingDepartments,
    isFetching: isFetchingDepartments,
  } = useQuery(
    ['departments', selectedInstitution],
    () => getDepartments(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const data = React.useMemo(
    () =>
      isSuccessDepartments &&
      dataDepartments?.data?.map(department => ({
        id: department.id,
        type: department.department_type.name,
        name: department.name,
        description: department.description,
        events: department.event_node,
      })),
    [dataDepartments?.data, isSuccessDepartments]
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
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Event Node',
        accessor: 'events',
        Cell: ({ value }) => (
          <SimpleGrid columns={3}>
            {value.map(item => (
              <Badge key={item.id}>{item.name}</Badge>
            ))}
          </SimpleGrid>
        ),
      },
    ],
    []
  );

  return (
    <>
      {isFetchingDepartments && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <AddDepartmentModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />

      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoadingDepartments}
        skeletonCols={5}
        action={
          <PrivateComponent
            permission={Permissions.createInstitutionDepartment}
          >
            <Button colorScheme="purple" onClick={onModalOpen}>
              Add New Deparment
            </Button>
          </PrivateComponent>
        }
      />
    </>
  );
};
