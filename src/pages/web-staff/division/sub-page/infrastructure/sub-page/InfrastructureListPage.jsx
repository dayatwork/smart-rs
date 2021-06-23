/* eslint-disable react/display-name */
import React, { useState, useCallback, useContext } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Button,
  Spinner,
  HStack,
  IconButton,
  useDisclosure,
  Badge,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { HiPencilAlt } from 'react-icons/hi';

import { AuthContext } from '../../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../../api/institution-services/institution';
import { getInfrastructures } from '../../../../../../api/institution-services/infrastructure';
import PaginationTable from '../../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../../components/shared/BackButton';
import {
  AddInfrastructureModal,
  EditInfrastructureDrawer,
} from '../../../../../../components/web-staff/division/infrastructure/list';

export const InfrastructureListPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [selectedInfrastructure, setSelectedInfrastructure] = useState(null);

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

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    data: dataInfrastructures,
    isSuccess: isSuccessInfrastructures,
    isLoading: isLoadingInfrastructures,
    isFetching: isFetchingInfrastructures,
  } = useQuery(
    'infrastructures',
    () => getInfrastructures(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
    }
  );

  const handleEdit = useCallback(
    infrastructureId => {
      const infrastructure = dataInfrastructures?.data.find(
        infra => infra.id === infrastructureId
      );
      setSelectedInfrastructure(infrastructure);
      onDrawerOpen();
    },
    [onDrawerOpen, dataInfrastructures?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccessInfrastructures &&
      dataInfrastructures?.data?.map(infrastructure => ({
        id: infrastructure.id,
        type: infrastructure.infrastructure_type?.name,
        name: infrastructure.name,
        description: infrastructure.description,
        department: infrastructure.department.name,
        department_id: infrastructure.department_id,
        status: infrastructure.status,
        status_reason: infrastructure.status_reason,
      })),
    [dataInfrastructures?.data, isSuccessInfrastructures]
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
        // Cell: ({ value }) => {
        //   const { data: resType } = useQuery(
        //     ["department-types", value],
        //     () => getDepartmentTypeById(cookies, value),
        //     { enabled: Boolean(value) }
        //   );
        //   return resType?.data?.name || "-";
        // },
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
      {
        Header: 'Department',
        accessor: 'department',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value === 'active') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
      },
      {
        Header: 'Status Reason',
        accessor: 'status_reason',
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
      {isFetchingInfrastructures && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddInfrastructureModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />
      <EditInfrastructureDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedInfrastructure={selectedInfrastructure}
        setSelectedInfrastructure={setSelectedInfrastructure}
        selectedInstitution={selectedInstitution}
      />

      <BackButton to="/division/infrastructure" text="Back to Infrastructure" />
      <Heading mb="6" fontSize="3xl">
        Infrastructure List
      </Heading>

      {user?.role?.alias && (
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
          skeletonCols={8}
          columns={columns}
          data={data || []}
          isLoading={isLoadingInfrastructures}
          action={
            <Button colorScheme="purple" onClick={onModalOpen}>
              Add Infrastructure
            </Button>
          }
        />
      )}
    </Box>
  );
};
