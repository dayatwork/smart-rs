/* eslint-disable react/display-name */
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { getInstitutions } from '../../../../api/institution-services/institution';
import { getPaymentMethods } from '../../../../api/institution-services/payment-method';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import { AddPaymentMethodModal } from '../../../../components/web-staff/institution-management/payment-method';
import { BackButton } from '../../../../components/shared/BackButton';

export const PaymentMethodPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    '3f026d44-6b43-47ce-ba4b-4d0a8b174286',
  );

  const {
    onOpen: onModalOpen,
    isOpen: isModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const { data: dataInstitutions, isSuccess: isSuccessInstitutions } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity },
  );

  const {
    data: dataPaymentMethods,
    isSuccess: isSuccessPaymentMethods,
    isLoading: isLoadingPaymentMethods,
    isFetching: isFetchingPaymentMethods,
  } = useQuery(
    ['insitution-payment-methods', selectedInstitution],
    () => getPaymentMethods(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity },
  );

  const data = React.useMemo(
    () =>
      isSuccessPaymentMethods &&
      dataPaymentMethods?.data?.map((paymentMethod) => ({
        id: paymentMethod?.id,
        name: paymentMethod?.name,
        alias: paymentMethod?.alias,
        description: paymentMethod?.description,
      })),
    [dataPaymentMethods?.data, isSuccessPaymentMethods],
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
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }) => (value ? value : '-'),
      },
    ],
    [],
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

      <BackButton
        to="/institution-management"
        text="Back to Institution Management List"
      />

      <Heading mb="6" fontSize="3xl">
        Payment Method
      </Heading>
      <Box>
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
          <>
            <PaginationTable
              columns={columns}
              data={data || []}
              isLoading={isLoadingPaymentMethods}
              skeletonCols={4}
              action={
                <Button colorScheme="purple" onClick={onModalOpen}>
                  Add New Payment Method
                </Button>
              }
            />
          </>
        )}
      </Box>
    </Box>
  );
};
