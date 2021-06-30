/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, Button, Flex, Heading } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';

import { WebPatientNav, Wrapper } from '../../components/web-patient/shared';
import { BookingTable } from '../../components/web-patient/booking-list';
import { getUserSoaps } from '../../api/medical-record-services/soap';

export const PatientExaminationResultsPage = () => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataSoap,
    isLoading: isLoadingSoap,
    isSuccess: isSuccessSoap,
  } = useQuery('user-soap-list', () => getUserSoaps(cookies));

  // console.log({ dataSoap });

  const data1 = React.useMemo(
    () =>
      isSuccessSoap &&
      dataSoap?.data?.map(soap => {
        return {
          id: soap.id,
          doctor_name: soap.doctor?.name,
          transaction_number: soap.transaction_number,
          date: soap.date,
          status: soap.status,
        };
      }),
    [isSuccessSoap, dataSoap?.data]
  );

  const columns1 = React.useMemo(
    () => [
      {
        Header: 'Dokter',
        accessor: 'doctor_name',
      },
      {
        Header: 'Transaction Number',
        accessor: 'transaction_number',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value?.toLowerCase() === 'completed') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          return <Badge colorScheme="blue">{value}</Badge>;
        },
      },
      {
        Header: 'Result',
        Cell: ({ row }) => {
          if (row.original.status !== 'completed') return null;
          return (
            <Button
              as={Link}
              to={`/examination/${row.original.id}`}
              variant="link"
              colorScheme="blue"
            >
              Result
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <Flex direction="column" bg="gray.100" minH="100vh">
      <Helmet>
        <title>Examination | SMART-RS</title>
      </Helmet>
      <WebPatientNav active="examination" />
      <Wrapper>
        <Heading fontSize="2xl" mb="6">
          Examination Result
        </Heading>

        <Box mb="4">
          {/* <Heading fontSize="lg" mb="2" fontWeight="medium">
            Order Saya
          </Heading> */}
          <BookingTable
            data={data1 || []}
            columns={columns1}
            isLoading={isLoadingSoap}
            skeletonCols={5}
          />
        </Box>
      </Wrapper>
    </Flex>
  );
};
