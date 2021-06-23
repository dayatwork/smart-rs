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
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { HiPencilAlt } from 'react-icons/hi';

import { AuthContext } from '../../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../../api/institution-services/institution';
import { getInfrastructureTypes } from '../../../../../../api/institution-services/infrastructure';
import PaginationTable from '../../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../../components/shared/BackButton';
import {
  AddInfrastructureTypeModal,
  EditInfrastructureTypeDrawer,
} from '../../../../../../components/web-staff/division/infrastructure/type';

export const InfrastructureTypePage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [selectedInfrastructureType, setSelectedInfrastructureType] =
    useState(null);

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
    data: dataInfrastructureTypes,
    isSuccess: isSuccessInfrastructureTypes,
    isLoading: isLoadingInfrastructureTypes,
    isFetching: isFetchingInfrastructureTypes,
  } = useQuery(
    'infrastructure-types',
    () => getInfrastructureTypes(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const handleEdit = useCallback(
    infrastructureTypeId => {
      const infrastructureType = dataInfrastructureTypes?.data.find(
        type => type.id === infrastructureTypeId
      );
      setSelectedInfrastructureType(infrastructureType);
      onDrawerOpen();
    },
    [onDrawerOpen, dataInfrastructureTypes?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccessInfrastructureTypes &&
      dataInfrastructureTypes?.data?.map(type => ({
        id: type.id,
        name: type.name,
        description: type.description,
      })),
    [dataInfrastructureTypes?.data, isSuccessInfrastructureTypes]
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
      {isFetchingInfrastructureTypes && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <AddInfrastructureTypeModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />
      <EditInfrastructureTypeDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedInfrastructure={selectedInfrastructureType}
        setSelectedInfrastructure={setSelectedInfrastructureType}
        selectedInstitution={selectedInstitution}
      />

      <BackButton to="/division/infrastructure" text="Back to Infrastructure" />
      <Heading mb="6" fontSize="3xl">
        Infrastructure Type
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
          skeletonCols={4}
          columns={columns}
          data={data || []}
          isLoading={isLoadingInfrastructureTypes}
          action={
            <Button colorScheme="purple" onClick={onModalOpen}>
              Add Infrastructure Type
            </Button>
          }
        />
      )}
    </Box>
  );
};
