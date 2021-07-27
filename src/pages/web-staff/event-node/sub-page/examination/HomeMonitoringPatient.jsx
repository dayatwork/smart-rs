/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  HStack,
  Spinner,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getSoaps } from 'api/medical-record-services/soap';
// import { getPatientMonitoringList } from 'api/medical-record-services/patient-monitoring';
import PaginationTable from 'components/shared/tables/PaginationTable';
import { PrivateComponent, Permissions } from 'access-control';

export const HomeMonitoringPatient = ({
  selectedInstitution,
  fromPatientMenu,
}) => {
  const [cookies] = useCookies(['token']);
  const [isToday, setIsToday] = useState(true);

  const {
    data: dataSoapList,
    isSuccess: isSuccessSoapList,
    isLoading: isLoadingSoapList,
    isFetching: isFetchingSoapList,
  } = useQuery(
    ['soap-list', 'process', selectedInstitution],
    () => getSoaps(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  // const {
  //   data: dataMonitoringList,
  //   isSuccess: isSuccessMonitoringList,
  //   isLoading: isLoadingMonitoringList,
  //   isFetching: isFetchingMonitoringList,
  // } = useQuery(['patient-monitoring-list'], () =>
  //   getPatientMonitoringList(cookies)
  // );

  // console.log({ dataMonitoringList });
  // console.log({ dataSoapList });

  const data = React.useMemo(
    () =>
      isSuccessSoapList &&
      dataSoapList?.data
        ?.filter(soap => {
          // console.log({ soap });
          if (isToday) {
            return (
              new Date(soap?.date.split('T')[0]).toISOString() ===
              new Date(new Date().toISOString().split('T')[0]).toISOString()
            );
          }
          return soap;
        })
        .map(soap => {
          return {
            id: soap?.id,
            soap_date: soap?.date,
            soap_number: soap?.soap_number,
            patient_id: soap?.patient_id,
            patient_name: soap?.patient_data?.name,
            patient_number: soap?.patient_data?.patient_number,
            patient_status: soap?.patient_data?.critical,
            doctor_id: soap?.doctor_id,
            status: soap?.status,
            transaction_number: soap?.transaction_number,
          };
        }),
    [dataSoapList?.data, isSuccessSoapList, isToday]
  );

  // const data = React.useMemo(
  //   () =>
  //     isSuccessMonitoringList &&
  //     dataMonitoringList?.data?.map(monitoring => {
  //         return {
  //           id: monitoring?.id,
  //           patient_id: monitoring?.patient_id,
  //           patient_name: monitoring?.patient_data?.name,
  //           patient_number: monitoring?.patient_data?.patient_number,
  //           patient_status: monitoring?.patient_data?.critical,
  //           doctor_id: monitoring?.doctor_id,
  //         };
  //       }),
  //   [dataSoapList?.data, isSuccessSoapList, isToday]
  // );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Date',
        accessor: 'soap_date',
        Cell: ({ value }) => <Box>{value?.split('T')[0]}</Box>,
      },
      {
        Header: 'Patient Name',
        accessor: 'patient_name',
      },
      {
        Header: 'Patient Number',
        accessor: 'patient_number',
      },
      {
        Header: 'Transaction Number',
        accessor: 'transaction_number',
      },
      {
        Header: 'Patient Status',
        accessor: 'patient_status',
        Cell: ({ value }) => (
          <Box
            as="span"
            rounded="md"
            fontWeight="semibold"
            color={value === 'Critical' ? 'red.500' : 'black'}
          >
            {value}
          </Box>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <Badge colorScheme="blue">{value}</Badge>,
      },
      {
        Header: 'Action',

        Cell: () => (
          <PrivateComponent permission={Permissions['call-patientExamination']}>
            <Button
              size="sm"
              p="2"
              rounded="md"
              fontWeight="semibold"
              colorScheme="green"
            >
              Call Now
            </Button>
          </PrivateComponent>
        ),
      },
      {
        Header: 'Details',
        Cell: ({ row }) => (
          <PrivateComponent permission={Permissions['read-detailExamination']}>
            <Button
              size="sm"
              colorScheme="purple"
              variant="outline"
              as={Link}
              to={
                fromPatientMenu
                  ? `/patient/soap/${row.original.id}`
                  : `/events/examination/details/${row.original.id}`
              }
            >
              Details
            </Button>
          </PrivateComponent>
        ),
      },
    ],
    [fromPatientMenu]
  );

  return (
    <Box py="6">
      {isFetchingSoapList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}

      <PaginationTable
        skeletonCols={9}
        columns={columns}
        data={data || []}
        isLoading={isLoadingSoapList}
        action={
          <HStack p="2">
            <Text
              fontWeight="semibold"
              fontSize={{ base: 'sm', md: 'md' }}
              mt={{ base: '-1.5', md: '0' }}
              color="gray.500"
            >
              Only Today
            </Text>
            <Switch
              colorScheme="purple"
              isChecked={isToday}
              onChange={e => setIsToday(e.target.checked)}
            />
          </HStack>
        }
      />
    </Box>
  );
};
