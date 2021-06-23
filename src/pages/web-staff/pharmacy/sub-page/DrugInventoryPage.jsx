/* eslint-disable react/display-name */
import React, { useState, useCallback, useContext } from 'react';
import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useClipboard,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { HiPencilAlt } from 'react-icons/hi';

import { AuthContext } from '../../../../contexts/authContext';
import { getInstitutions } from '../../../../api/institution-services/institution';
import { getDrugs } from '../../../../api/pharmacy-services/drug';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddDrugModal,
  EditDrugDrawer,
} from '../../../../components/web-staff/pharmacy/drug-inventory';
import { BackButton } from '../../../../components/shared/BackButton';

export const DrugInventoryPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [clipboardValue, setClipboardValue] = useState('');
  const { hasCopied, onCopy } = useClipboard(clipboardValue);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );

  const {
    onOpen: onAddDrugModalOpen,
    isOpen: isAddDrugModalOpen,
    onClose: onAddDrugModalClose,
  } = useDisclosure();
  const {
    onOpen: onEditDrugDrawerOpen,
    isOpen: isEditDrugDrawerOpen,
    onClose: onEditDrugDrawerClose,
  } = useDisclosure();

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    data: dataDrugs,
    isSuccess: isSuccessDrugs,
    isLoading: isLoadingDrugs,
    isFetching: isFetchingDrugs,
  } = useQuery(
    ['drugs', selectedInstitution],
    () => getDrugs(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const handleEdit = useCallback(
    drugId => {
      const drug = dataDrugs?.data.find(drug => drug.id === drugId);
      setSelectedDrug(drug);
      onEditDrugDrawerOpen();
    },
    [dataDrugs?.data, onEditDrugDrawerOpen]
  );

  const data = React.useMemo(
    () =>
      isSuccessDrugs &&
      dataDrugs?.data?.map(drug => {
        return {
          id: drug.id,
          name: drug.name,
          type: drug.type,
          price: drug.price,
          expired: drug.expired,
          quantity: drug.quantity,
          description: drug.description,
        };
      }),
    [dataDrugs?.data, isSuccessDrugs]
  );

  // console.log({ dataDrugs });

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => (
          <Tooltip label={`${value} - Click to copy`} aria-label="A tooltip">
            <Box display="flex" position="relative">
              <Box
                as="span"
                onClick={() => {
                  setClipboardValue(value);
                  onCopy();
                }}
                _hover={{ cursor: 'pointer' }}
              >
                {value?.substring(0, 5)}
              </Box>
              {hasCopied && clipboardValue === value && (
                <Box
                  as="span"
                  display="inline-block"
                  fontSize="sm"
                  bg="gray.200"
                  color="gray.600"
                  fontStyle="italic"
                  fontWeight="semibold"
                  position="absolute"
                  right="-4"
                  px="1"
                  rounded="md"
                >
                  Copied!
                </Box>
              )}
            </Box>
          </Tooltip>
        ),
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Expired',
        accessor: 'expired',
        Cell: ({ value }) => {
          if (!value) return '-';
          return value.split('T')[0];
        },
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }) => {
          if (!value) return '-';
          return <Text maxW="sm">{value}</Text>;
        },
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
    [handleEdit, clipboardValue, hasCopied, onCopy]
  );

  return (
    <Box>
      {isFetchingDrugs && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <AddDrugModal
        isOpen={isAddDrugModalOpen}
        onClose={onAddDrugModalClose}
        selectedInstitution={selectedInstitution}
      />
      <EditDrugDrawer
        isOpen={isEditDrugDrawerOpen}
        onClose={onEditDrugDrawerClose}
        selectedDrug={selectedDrug}
      />

      <BackButton to="/pharmacy" text="Back to Pharmacy" />
      <Heading mb="6" fontSize="3xl">
        Drug Inventory
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
          columns={columns}
          data={data || []}
          isLoading={isLoadingDrugs}
          skeletonCols={8}
          action={
            <HStack>
              <Button onClick={onAddDrugModalOpen} colorScheme="purple">
                Add New Drugs
              </Button>
              {/* <Button onClick={onAssignUserModalOpen} colorScheme="green">
              Assign User
            </Button> */}
            </HStack>
          }
        />
      )}
    </Box>
  );
};
