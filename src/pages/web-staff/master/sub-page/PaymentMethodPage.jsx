/* eslint-disable react/display-name */
import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Heading,
  Spinner,
  useDisclosure,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { HiPencilAlt } from 'react-icons/hi';

import { getPaymentMethods } from '../../../../api/master-data-services/payment-method';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';
import {
  AddPaymentMethodModal,
  EditPaymentMethodDrawer,
} from '../../../../components/web-staff/master/payment-method';
import { BackButton } from '../../../../components/shared/BackButton';

export const PaymentMethodPage = () => {
  const [cookies] = useCookies(['token']);
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

  const {
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery('master-payment-methods', () => getPaymentMethods(cookies), {
    staleTime: Infinity,
  });

  const handleEdit = useCallback(
    paymentMethodId => {
      const paymentMethod = res?.data.find(
        paymentMethod => paymentMethod.id === paymentMethodId
      );
      setSelectedPaymentMethod(paymentMethod);
      onDrawerOpen();
    },
    [onDrawerOpen, res?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(paymentMethod => {
        return {
          id: paymentMethod.id,
          name: paymentMethod.name,
          alias: paymentMethod.alias,
          description: paymentMethod.description,
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
        Header: 'Alias',
        accessor: 'alias',
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

      <AddPaymentMethodModal isOpen={isModalOpen} onClose={onModalClose} />
      <EditPaymentMethodDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
      />

      <BackButton to="/master" text="Back to Master List" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Payment Method
      </Heading>
      <PaginationTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        skeletonCols={5}
        action={
          <Button onClick={onModalOpen} colorScheme="purple">
            Add New Payment Method
          </Button>
        }
      />
    </Box>
  );
};
