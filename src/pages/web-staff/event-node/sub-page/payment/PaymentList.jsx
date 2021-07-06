import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../api/institution-services/institution';
import { getInstitutionOrderList } from '../../../../../api/payment-services/order';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../components/shared/BackButton';
import { PrivateComponent, Permissions } from '../../../../../access-control';

export const PaymentList = ({ fromFinanceMenu }) => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    data: dataInstitutionOrderList,
    isSuccess: isSuccessInstitutionOrderList,
    isLoading: isLoadingInstitutionOrderList,
    isFetching: isFetchingInstitutionOrderList,
  } = useQuery(
    ['institution-order-list', selectedInstitution],
    () => getInstitutionOrderList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const data = React.useMemo(
    () =>
      isSuccessInstitutionOrderList &&
      dataInstitutionOrderList?.data?.map(order => {
        return {
          id: order?.id,
          transaction_number: order?.transaction_number,
          invoice_date: order?.invoice_date,
          total_price: order?.total_price,
          due_date: order?.due_date,
          status: order?.status,
          method_id: order?.method_id,
          method_name: order?.method_name,
          institution_id: order?.institution_id,
          type: order?.type,
        };
      }),
    [dataInstitutionOrderList?.data, isSuccessInstitutionOrderList]
  );

  // console.log({ dataInstitutionOrderList });

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Transaction Number',
        accessor: 'transaction_number',
      },
      {
        Header: 'Invoice Date',
        accessor: 'invoice_date',
      },
      {
        Header: 'Total Price',
        accessor: 'total_price',
        Cell: ({ value }) => formatter.format(value),
      },
      {
        Header: 'Due Date',
        accessor: 'due_date',
      },
      {
        Header: 'Status',
        accessor: 'status',
        // Cell: ({ value }) => {
        //   if (value.toLowerCase() === 'paid') {
        //     return <Badge colorScheme="green">{value}</Badge>;
        //   }
        //   return <Badge>{value}</Badge>;
        // },
        Cell: ({ value }) => {
          if (value?.toLowerCase() === 'paid') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          if (value?.toLowerCase() === 'cancel') {
            return <Badge colorScheme="red">{value}</Badge>;
          }
          if (value?.toLowerCase() === 'over due') {
            return <Badge colorScheme="orange">{value}</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
      },
      {
        Header: 'Method',
        accessor: 'method_name',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Detail',
        Cell: ({ row }) => (
          <PrivateComponent permission={Permissions['read-detailPayment']}>
            <Button
              as={Link}
              to={
                fromFinanceMenu
                  ? `/finance/patient-payment/${row.original.id}`
                  : `/events/payment/${row.original.id}`
              }
              variant="link"
              colorScheme="purple"
            >
              Detail
            </Button>
          </PrivateComponent>
        ),
      },
    ],
    [fromFinanceMenu]
  );

  return (
    <Box>
      {isFetchingInstitutionOrderList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      {fromFinanceMenu ? (
        <BackButton to="/finance" text="Back to Finance " />
      ) : (
        <BackButton to="/events" text="Back to Events List" />
      )}
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        {fromFinanceMenu ? 'Patient Payment' : 'Payment'}
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
          isLoading={isLoadingInstitutionOrderList}
          skeletonCols={9}
        />
      )}
    </Box>
  );
};

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});
