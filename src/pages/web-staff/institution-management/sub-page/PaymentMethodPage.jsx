/* eslint-disable react/display-name */
import React, { useState, useCallback, useContext } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  useDisclosure,
  Spinner,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { HiPencilAlt } from 'react-icons/hi';

import { AuthContext } from '../../../../contexts/authContext';
import { getInstitutions } from '../../../../api/institution-services/institution';
import { getPaymentMethods } from '../../../../api/institution-services/payment-method';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddPaymentMethodModal,
  EditPaymentMethodDrawer,
} from '../../../../components/web-staff/institution-management/payment-method';
import { BackButton } from '../../../../components/shared/BackButton';
import { PrivateComponent, Permissions } from '../../../../access-control';

export const PaymentMethodPage = ({ fromFinanceMenu }) => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

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

  const { data: dataInstitutions, isSuccess: isSuccessInstitutions } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    data: dataPaymentMethods,
    isSuccess: isSuccessPaymentMethods,
    isLoading: isLoadingPaymentMethods,
    isFetching: isFetchingPaymentMethods,
  } = useQuery(
    ['insitution-payment-methods', selectedInstitution],
    () => getPaymentMethods(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const handleEdit = useCallback(
    paymentMethodId => {
      const paymentMethod = dataPaymentMethods?.data.find(
        paymentMethod => paymentMethod.id === paymentMethodId
      );
      setSelectedPaymentMethod(paymentMethod);
      onDrawerOpen();
    },
    [onDrawerOpen, dataPaymentMethods?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccessPaymentMethods &&
      dataPaymentMethods?.data?.map(paymentMethod => ({
        id: paymentMethod?.id,
        name: paymentMethod?.name,
        alias: paymentMethod?.alias,
        account_number: paymentMethod?.account_number,
        account_name: paymentMethod?.account_name,
        description: paymentMethod?.description,
        active: paymentMethod?.active,
      })),
    [dataPaymentMethods?.data, isSuccessPaymentMethods]
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
        Header: 'Alias',
        accessor: 'alias',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Account Number',
        accessor: 'account_number',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Account Name',
        accessor: 'account_name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Status',
        accessor: 'active',
        Cell: ({ value }) => (
          <Badge colorScheme={value ? 'green' : 'gray'}>
            {value ? 'Active' : 'Not Active'}
          </Badge>
        ),
      },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <IconButton
            aria-label="Edit"
            colorScheme="blackAlpha"
            icon={<HiPencilAlt />}
            onClick={() => handleEdit(row.original.id)}
          />
        ),
      },
    ],
    [handleEdit]
  );

  return (
    <Box>
      {isFetchingPaymentMethods && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <AddPaymentMethodModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        selectedInstitution={selectedInstitution}
      />
      <EditPaymentMethodDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedInstitution={selectedInstitution}
        selectedPaymentMethod={selectedPaymentMethod}
      />

      {fromFinanceMenu ? (
        <BackButton to="/finance" text="Back to Finance" />
      ) : (
        <BackButton
          to="/institution-management"
          text="Back to Institution Management List"
        />
      )}

      <Heading mb="6" fontSize="3xl">
        Payment Method
      </Heading>
      <Box>
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
          <>
            <PaginationTable
              columns={columns}
              data={data || []}
              isLoading={isLoadingPaymentMethods}
              skeletonCols={7}
              action={
                <PrivateComponent
                  permission={Permissions.createInstitutionPaymentMethod}
                >
                  <Button colorScheme="purple" onClick={onModalOpen}>
                    Add New Payment Method
                  </Button>
                </PrivateComponent>
              }
            />
          </>
        )}
      </Box>
    </Box>
  );
};
