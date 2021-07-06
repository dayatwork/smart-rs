/* eslint-disable react/display-name */
import React, { useContext, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Spinner, Switch, Text, HStack } from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';

import { AuthContext } from '../../../../../contexts/authContext';
import {
  getBookingList,
  updateBookingStatus,
} from '../../../../../api/booking-services/booking';
import { getHospitalPatientById } from '../../../../../api/patient-services/hospital-patient';
import { createSoap } from '../../../../../api/medical-record-services/soap';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';
import { PrivateComponent, Permissions } from '../../../../../access-control';
// import { PrivateComponent } from 'components/common/PrivateComponent';
// import { Permissions } from 'constants/permissions';

export const WaitingPatient = ({ selectedInstitution, fromPatientMenu }) => {
  const history = useHistory();
  const [cookies] = useCookies(['token']);
  const { employeeDetail } = useContext(AuthContext);
  const [isLoadingCreateSoap, SetIsLoadingCreateSoap] = useState(false);
  const [patient, setPatient] = useState('');
  const [isToday, setIsToday] = useState(true);
  const queryClient = useQueryClient();

  const {
    data: dataBookingList,
    isSuccess: isSuccessBookingList,
    isLoading: isLoadingBookingList,
    isFetching: isFetchingBookingList,
  } = useQuery(
    ['booking-list', selectedInstitution],
    () => getBookingList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  // console.log({ dataBookingList });

  const handleCreateSoap = useCallback(
    async (patient_id, booking_id, transaction_number) => {
      setPatient(patient_id);
      try {
        SetIsLoadingCreateSoap(true);
        const patientDetail = await getHospitalPatientById(cookies, {
          institution_id: selectedInstitution,
          patient_id,
        });
        const dataCreateSoap = {
          institution_id: selectedInstitution,
          patient_id: patient_id,
          user_id: patientDetail?.data?.patient?.user_id,
          doctor_id: employeeDetail?.employee_id,
          booking_id,
          transaction_number: transaction_number,
        };

        const dataUpdateBookingStatus = {
          id: booking_id,
          status: 'examination',
        };
        const res = await createSoap(cookies, dataCreateSoap);
        await updateBookingStatus(cookies, dataUpdateBookingStatus);
        await queryClient.invalidateQueries([
          'booking-list',
          selectedInstitution,
        ]);
        SetIsLoadingCreateSoap(false);
        history.replace(`/events/examination/details/${res.data.id}`);
      } catch (error) {
        SetIsLoadingCreateSoap(false);
      }
    },
    [
      cookies,
      selectedInstitution,
      history,
      queryClient,
      employeeDetail?.employee_id,
    ]
  );

  const data = React.useMemo(
    () =>
      isSuccessBookingList &&
      dataBookingList?.data
        ?.filter(booking => booking.booking_status === 'done')
        ?.filter(booking => {
          // console.log({ booking });
          if (isToday) {
            return (
              new Date(booking?.date).toISOString() ===
              new Date(new Date().toISOString().split('T')[0]).toISOString()
            );
          }
          return booking;
        })
        .map(booking => {
          return {
            booking_id: booking.id,
            patient_id: booking.patient_id,
            patient_name: booking.patient_name,
            service_name: booking?.service_name,
            schedule_id: booking?.schedule_id,
            schedule_date: booking.schedule_date,
            schedule_time: booking.schedule_time,
            doctor_name: booking.doctor_name,
            poli: booking.poli,
            status: booking.booking_status,
            transaction_number: booking.transaction_number,
          };
        }),
    [dataBookingList?.data, isSuccessBookingList, isToday]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Booking ID',
        accessor: 'booking_id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Patient ID',
        accessor: 'patient_id',
        // Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Transaction Number',
        accessor: 'transaction_number',
      },
      {
        Header: 'Nama Pasien',
        accessor: 'patient_name',
      },
      {
        Header: 'Layanan',
        accessor: 'service_name',
      },
      {
        Header: 'Dokter',
        accessor: 'doctor_name',
      },
      {
        Header: 'Details',
        Cell: ({ row }) => (
          <PrivateComponent permission={Permissions.createExamination}>
            <Button
              colorScheme="purple"
              size="sm"
              onClick={() =>
                handleCreateSoap(
                  row.original.patient_id,
                  row.original.booking_id,
                  row.original.transaction_number
                )
              }
              isLoading={
                isLoadingCreateSoap && patient === row.original.patient_id
              }
            >
              Start Anamnesis
            </Button>
          </PrivateComponent>
        ),
      },
    ],
    [handleCreateSoap, isLoadingCreateSoap, patient]
  );

  return (
    <Box py="6">
      {isFetchingBookingList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <Helmet>
        <title>Examination | SMART-RS</title>
      </Helmet>

      <PaginationTable
        columns={columns}
        data={data || []}
        skeletonCols={7}
        isLoading={isLoadingBookingList}
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
