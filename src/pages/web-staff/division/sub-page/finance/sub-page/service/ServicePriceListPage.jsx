/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Button,
  Spinner,
  HStack,
  Badge,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../../../api/institution-services/institution';
import { getServicePrice } from '../../../../../../../api/finance-services/service-price';
import PaginationTable from '../../../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../../../components/shared/BackButton';

export const ServicePriceListPage = () => {
  const { employeeDetail } = useContext(AuthContext);
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
    data: dataServicePrice,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery(
    ['service-price', selectedInstitution],
    () => getServicePrice(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const data = React.useMemo(
    // () => {},
    // []
    () =>
      isSuccess &&
      dataServicePrice?.data?.map(servPrice => {
        return {
          id: servPrice.id,
          service_id: servPrice.service_id,
          service_name: servPrice.name,
          total_price: servPrice.total_price,
          patient_type: servPrice.patient_type,
        };
      }),
    [dataServicePrice?.data, isSuccess]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Nama Tarif',
        accessor: 'service_name',
      },
      {
        Header: 'Total Price',
        accessor: 'total_price',
        Cell: ({ value }) => `${value} IDR`,
      },
      {
        Header: 'Patient Type',
        accessor: 'patient_type',
        Cell: ({ value }) => (
          <HStack spacing="2">
            {value.map(v => (
              <Badge key={v}>{v}</Badge>
            ))}
          </HStack>
        ),
      },

      {
        Header: 'Action',
        // accessor: "userId",
        Cell: ({ row }) => (
          <VStack align="flex-start">
            <Button
              variant="link"
              size="sm"
              colorScheme="purple"
              // onClick={onDetailOpen}
            >
              View Detail
            </Button>
          </VStack>
        ),
      },
    ],
    []
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <BackButton to="/division/finance" text="Back to Finance" />
      <Heading mb="6" fontSize="3xl">
        Service Price List
      </Heading>

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

      {selectedInstitution && (
        <PaginationTable
          skeletonCols={5}
          columns={columns}
          data={data || []}
          isLoading={isLoading}
          action={
            <Button
              colorScheme="purple"
              as={Link}
              to="/division/finance/service/create"
            >
              Create Service Price
            </Button>
          }
        />
      )}
    </Box>
  );
};
