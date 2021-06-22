/* eslint-disable react/display-name */
import React, { useContext, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Spinner } from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../../contexts/authContext';
import {
  getBookingList,
  updateBookingStatus,
} from '../../../../../api/booking-services/booking';
import { getHospitalPatientById } from '../../../../../api/patient-services/hospital-patient';
import { createSoap } from '../../../../../api/medical-record-services/soap';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';
// import { PrivateComponent } from 'components/common/PrivateComponent';
// import { Permissions } from 'constants/permissions';

export const WaitingPatient = ({ selectedInstitution, fromPatientMenu }) => {
  const history = useHistory();
  const [cookies] = useCookies(['token']);
  const { employeeDetail } = useContext(AuthContext);
  const [isLoadingCreateSoap, SetIsLoadingCreateSoap] = useState(false);
  const [patient, setPatient] = useState('');
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
          booking_id,
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
    [dataBookingList?.data, isSuccessBookingList]
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
          // <PrivateComponent permission={Permissions.createExamination}>
          <Button
            colorScheme="purple"
            // as={Link}
            // to="/events/examination/details"
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
          // </PrivateComponent>
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

      <PaginationTable
        columns={columns}
        data={data || []}
        skeletonCols={7}
        // isLoading={isLoadingHospitalPatients}
        isLoading={isLoadingBookingList}
      />
    </Box>
  );
};
