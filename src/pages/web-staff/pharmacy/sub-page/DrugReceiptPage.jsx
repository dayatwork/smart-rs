/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  Spinner,
  Tooltip,
  useClipboard,
  FormLabel,
  Select,
  Badge,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../contexts/authContext';
import { getInstitutions } from '../../../../api/institution-services/institution';
import { getDrugOrders } from '../../../../api/pharmacy-services/receipt';
import { BackButton } from '../../../../components/shared/BackButton';
import PaginationTable from '../../../../components/shared/tables/PaginationTable';

export const DrugReceiptPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const { path } = useRouteMatch();
  const [cookies] = useCookies(['token']);
  const [clipboardValue, setClipboardValue] = useState('');
  const { hasCopied, onCopy } = useClipboard(clipboardValue);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies)
  );

  const {
    data: dataDrugOrders,
    isSuccess: isSuccessDrugOrders,
    isLoading: isLoadingDrugOrders,
    isFetching: isFetchingDrugOrders,
  } = useQuery(
    ['drugs-order', selectedInstitution],
    () => getDrugOrders(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const data = React.useMemo(
    () =>
      isSuccessDrugOrders &&
      dataDrugOrders?.data?.map(drugOrder => {
        return {
          id: drugOrder.id,
          employee_name: drugOrder.employee_name,
          comments: drugOrder.comments,
          total_price: drugOrder.total_price,
          status: drugOrder.status,
          patient_id: drugOrder.patient_id,
          patient_name: drugOrder.patient_name,
        };
      }),
    [dataDrugOrders?.data, isSuccessDrugOrders]
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
        Header: 'Patient Name',
        accessor: 'patient_name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Employee Name',
        accessor: 'employee_name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Comments',
        accessor: 'comments',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Total Price',
        accessor: 'total_price',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value === 'Delivered') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          if (value === 'packed') {
            return <Badge colorScheme="blue">{value}</Badge>;
          }
          if (value === 'packaging') {
            return <Badge colorScheme="yellow">{value}</Badge>;
          }
          return <Badge colorScheme="gray">{value}</Badge>;
        },
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          if (
            row.original.status === 'Delivered' ||
            row.original.status === 'packed' ||
            row.original.status === 'packaging'
          ) {
            return null;
          }
          return (
            <HStack>
              <Button
                variant="link"
                as={Link}
                colorScheme="purple"
                to={`${path}/${row.original.id}`}
              >
                Details
              </Button>
            </HStack>
          );
        },
      },
    ],
    [clipboardValue, hasCopied, onCopy, path]
  );

  return (
    <Box>
      {isFetchingDrugOrders && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <BackButton to="/pharmacy" text="Back to Pharmacy" />
      <Heading mb="6" fontSize="3xl">
        Receipt
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
          columns={columns}
          data={data || []}
          isLoading={isLoadingDrugOrders}
          skeletonCols={7}
        />
      )}
    </Box>
  );
};
