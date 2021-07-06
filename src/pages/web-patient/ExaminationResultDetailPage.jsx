/* eslint-disable react/display-name */
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Center, Flex, Heading, Spinner } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';

import { WebPatientNav, Wrapper } from '../../components/web-patient/shared';
import {
  getSoapById,
  getPatientPrescription,
} from '../../api/medical-record-services/soap';
import { BookingTable } from '../../components/web-patient/booking-list';
import { BsCaretLeftFill } from 'react-icons/bs';

const PatientExaminationResultsDetailPage = () => {
  const params = useParams();
  const [cookies] = useCookies(['token']);

  const { data: dataSoap, isLoading: isLoadingSoap } = useQuery(
    ['patient-soap', params.id],
    () => getSoapById(cookies, params.id),
    { enabled: Boolean(params.id) }
  );

  const {
    data: dataPatientPrescriptions,
    isLoading: isLoadingPatientPrescriptions,
    isSuccess: isSuccessPatientPrescriptions,
  } = useQuery(
    [
      'prescription',
      dataSoap?.data?.institution_id,
      dataSoap?.data?.soap_plans[0]?.id,
    ],
    () =>
      getPatientPrescription(
        cookies,
        dataSoap?.data?.institution_id,
        dataSoap?.data?.soap_plans[0]?.id
      ),
    {
      enabled:
        Boolean(cookies) &&
        Boolean(dataSoap?.data?.institution_id) &&
        Boolean(dataSoap?.data?.soap_plans[0]?.id),
    }
  );

  const data = React.useMemo(
    () =>
      isSuccessPatientPrescriptions &&
      dataPatientPrescriptions?.data?.map(prescription => {
        return {
          id: prescription.id,
          drug_name: prescription.drug_name,
          quantity: prescription.quantity,
          frequency: prescription.frequency,
          eat: prescription.eat,
          routine: prescription.routine,
          start_at: prescription.start_at,
          end_at: prescription.end_at,
        };
      }),
    [isSuccessPatientPrescriptions, dataPatientPrescriptions?.data]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Drug Name',
        accessor: 'drug_name',
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },
      {
        Header: 'Frequency',
        accessor: 'frequency',
        Cell: ({ value }) => value && value + ' times/day',
      },
      {
        Header: 'Eat',
        accessor: 'eat',
        Cell: ({ value }) => value && value + ' meals',
      },
      {
        Header: 'Routine',
        accessor: 'routine',
        Cell: ({ value }) => (value ? 'Yes' : 'No'),
      },
      {
        Header: 'Start At',
        accessor: 'start_at',
        Cell: ({ value }) =>
          value && new Date(value).toISOString().split('T')[0],
      },
      {
        Header: 'End At',
        accessor: 'end_at',
        Cell: ({ value }) =>
          value && new Date(value).toISOString().split('T')[0],
      },
    ],
    []
  );

  if (isLoadingSoap || isLoadingPatientPrescriptions) {
    return (
      <Flex direction="column" bg="gray.100" minH="100vh">
        <Helmet>
          <title>Examination Detail | SMART-RS</title>
        </Helmet>
        <WebPatientNav active="doctor" />
        <Wrapper>
          <Heading fontSize="2xl" mb="6">
            Examination Result Details
          </Heading>
          <Center h="60">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="secondary.light"
              color="secondary.dark"
              size="xl"
            />
          </Center>
        </Wrapper>
      </Flex>
    );
  }

  return (
    <Flex direction="column" bg="gray.100" minH="100vh">
      <Helmet>
        <title>Examination Detail | SMART-RS</title>
      </Helmet>
      <WebPatientNav active="examination" />
      <Wrapper>
        <Box
          as={Link}
          to="/examination"
          display="inline-flex"
          alignItems="center"
          color="secondary.dark"
          fontSize="sm"
          fontWeight="semibold"
          mb="4"
          rounded="lg"
          px="2"
          py="1"
          _hover={{ bg: 'gray.50' }}
        >
          <Box as={BsCaretLeftFill} fontSize="xs" marginEnd="1" />
          Back to list
        </Box>
        <Heading fontSize="2xl" mb="6">
          Examination Result Details
        </Heading>
        <Box px="6" py="4" bgColor="white" boxShadow="md">
          <Box mb="4">
            <Heading fontSize="xl">Examination Info</Heading>
            <Property
              label="Doctor Name"
              value={dataSoap?.data?.doctor?.name || '-'}
            />
          </Box>
          <Box>
            <Heading fontSize="xl">Prescription</Heading>
            <BookingTable
              data={data || []}
              columns={columns}
              isLoading={isLoadingPatientPrescriptions}
              skeletonCols={7}
              noFilter
            />
          </Box>
        </Box>
      </Wrapper>
    </Flex>
  );
};

export default PatientExaminationResultsDetailPage;

const Property = ({ label, value, ...flexProps }) => {
  return (
    <Flex
      as="dl"
      direction={{
        base: 'column',
        sm: 'row',
      }}
      // px="6"
      py="4"
      _even={{
        bg: 'gray.50',
      }}
      {...flexProps}
    >
      <Box as="dt" flexBasis={{ base: '40%', md: '30%' }}>
        {label}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
