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
  Tooltip,
  useDisclosure,
  useClipboard,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { HiPencilAlt } from 'react-icons/hi';

import { AuthContext } from '../../../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../../../api/institution-services/institution';
import { getDrugPriceList } from '../../../../../../../api/finance-services/drug-price';
import PaginationTable from '../../../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../../../components/shared/BackButton';
import {
  AddDrugPriceModal,
  EditDrugPriceDrawer,
} from '../../../../../../../components/web-staff/division/finance/pharmacy';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../../access-control';

export const DrugPriceListPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [clipboardValue, setClipboardValue] = useState('');
  const { hasCopied, onCopy } = useClipboard(clipboardValue);
  const [selectedDrug, setSelectedDrug] = useState(null);

  const {
    onOpen: onAddDrugPriceModalOpen,
    isOpen: isAddDrugPriceModalOpen,
    onClose: onAddDrugPriceModalClose,
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
    data: dataDrugPrices,
    isSuccess: isSuccessDrugPrices,
    isLoading: isLoadingDrugPrices,
    isFetching: isFetchingDrugPrices,
  } = useQuery(
    ['drug-prices', selectedInstitution],
    () => getDrugPriceList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const handleEdit = useCallback(
    drugId => {
      const drug = dataDrugPrices?.data.find(drug => drug.id === drugId);
      setSelectedDrug(drug);
      onEditDrugDrawerOpen();
    },
    [dataDrugPrices?.data, onEditDrugDrawerOpen]
  );

  const data = React.useMemo(
    () =>
      isSuccessDrugPrices &&
      dataDrugPrices?.data?.map(drugPrice => {
        return {
          id: drugPrice.id,
          drug_id: drugPrice.drug_id,
          name: drugPrice.name,
          tax: drugPrice.tax,
          price: drugPrice.price,
          currency: drugPrice.currency,
        };
      }),
    [dataDrugPrices?.data, isSuccessDrugPrices]
  );

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
        Header: 'Drug Name',
        accessor: 'name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Drug ID',
        accessor: 'drug_id',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Currency',
        accessor: 'currency',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Tax',
        accessor: 'tax',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <PrivateComponent permission={Permissions.updateDrugPrice}>
            <HStack>
              <IconButton
                aria-label="Edit"
                colorScheme="blackAlpha"
                icon={<HiPencilAlt />}
                onClick={() => handleEdit(row.original.id)}
              />
            </HStack>
          </PrivateComponent>
        ),
      },
    ],
    [handleEdit, clipboardValue, hasCopied, onCopy]
  );

  return (
    <Box>
      {isFetchingDrugPrices && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <AddDrugPriceModal
        isOpen={isAddDrugPriceModalOpen}
        onClose={onAddDrugPriceModalClose}
        selectedInstitution={selectedInstitution}
        alreadyDrugPrices={dataDrugPrices?.data?.map(
          drugPrice => drugPrice.drug_id
        )}
      />
      <EditDrugPriceDrawer
        isOpen={isEditDrugDrawerOpen}
        onClose={onEditDrugDrawerClose}
        selectedDrug={selectedDrug}
        selectedInstitution={selectedInstitution}
      />

      <BackButton to="/division/finance" text="Back to Finance" />
      <Heading mb="6" fontSize="3xl">
        Drug Price List
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
          skeletonCols={7}
          columns={columns}
          data={data || []}
          isLoading={isLoadingDrugPrices}
          action={
            <PrivateComponent permission={Permissions.createDrugPrice}>
              <Button colorScheme="purple" onClick={onAddDrugPriceModalOpen}>
                Add Drug Price
              </Button>
            </PrivateComponent>
          }
        />
      )}
    </Box>
  );
};
