/* eslint-disable react/display-name */
import React, { useState, useCallback } from 'react';
import {
  Box,
  Heading,
  VStack,
  Button,
  useDisclosure,
  Text,
  Divider,
  Stack,
} from '@chakra-ui/react';
import 'react-day-picker/lib/style.css';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { PrescriptionTable } from './plan/PrescriptionTable';
import { RequestLabTestModal } from './plan/RequestLabTestModal';
import { RequestRadiologyTestModal } from './plan/RequestRadiologyTestModal';
import { AddPrescriptionModal } from './plan/AddPrescriptionModal';
import { EditPrescriptionDrawer } from './plan/EditPrescriptionDrawer';
import { AppointmentModal } from './plan/AppointmentModal';
import { getPatientPrescription } from '../../../../../../api/medical-record-services/soap';

export const Plan = ({ patientDetail, dataSoap }) => {
  const {
    isOpen: isOpenRequestLabModal,
    onOpen: onOpenRequestLabModal,
    onClose: onCloseRequestLabModal,
  } = useDisclosure();

  const {
    isOpen: isOpenRequestRadiologyModal,
    onOpen: onOpenRequestRadiologyModal,
    onClose: onCloseRequestRadiologyModal,
  } = useDisclosure();

  const {
    isOpen: isOpenAppointmentModal,
    onOpen: onOpenAppointmentModal,
    onClose: onCloseAppointmentModal,
  } = useDisclosure();

  return (
    <>
      <RequestLabTestModal
        isOpen={isOpenRequestLabModal}
        onClose={onCloseRequestLabModal}
        dataSoap={dataSoap}
      />

      <RequestRadiologyTestModal
        isOpen={isOpenRequestRadiologyModal}
        onClose={onCloseRequestRadiologyModal}
        dataSoap={dataSoap}
      />

      <AppointmentModal
        isOpen={isOpenAppointmentModal}
        onClose={onCloseAppointmentModal}
      />

      <Box bg="white" boxShadow="md" p="4" overflow="auto">
        <VStack align="start" spacing="10">
          <Box px="4">
            <Heading fontSize="lg" fontWeight="semibold" mb="4">
              Procedure
            </Heading>
            <Stack direction={{ base: 'column', md: 'row' }}>
              <Button
                size="sm"
                onClick={onOpenRequestLabModal}
                colorScheme="green"
              >
                Request Lab Test
              </Button>
              <Button
                size="sm"
                onClick={onOpenRequestRadiologyModal}
                colorScheme="green"
              >
                Request Radiology Test
              </Button>
              <Button
                size="sm"
                onClick={onOpenAppointmentModal}
                colorScheme="green"
              >
                Follow up Appointment
              </Button>
            </Stack>
          </Box>
          <Divider />
          <Box w="full" px="4">
            <TablePrescription
              dataSoap={dataSoap}
              patientDetail={patientDetail}
            />
          </Box>
        </VStack>
      </Box>
    </>
  );
};

const TablePrescription = ({ dataSoap, patientDetail }) => {
  const [cookies] = useCookies(['token']);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const {
    isOpen: isOpenAddPrescriptionModal,
    onOpen: onOpenAddPrescriptionModal,
    onClose: onCloseAddPrescriptionModal,
  } = useDisclosure();
  const {
    isOpen: isOpenEditPrescriptionDrawer,
    onOpen: onOpenEditPrescriptionDrawer,
    onClose: onCloseEditPrescriptionDrawer,
  } = useDisclosure();

  const {
    data: dataPrescription,
    isLoading: isLoadingPrescription,
    isSuccess: isSuccessPrescription,
  } = useQuery(
    ['prescription', dataSoap?.institution_id, dataSoap?.soap_plans[0]?.id],
    () =>
      getPatientPrescription(
        cookies,
        dataSoap?.institution_id,
        dataSoap?.soap_plans[0]?.id
      ),
    {
      enabled:
        Boolean(dataSoap?.institution_id) &&
        Boolean(dataSoap?.soap_plans[0]?.id),
    }
  );

  const handleEdit = useCallback(
    id => {
      const prescription = dataPrescription?.data?.find(p => p.id === id);
      setSelectedPrescription(prescription);
      onOpenEditPrescriptionDrawer();
    },
    [dataPrescription?.data, onOpenEditPrescriptionDrawer]
  );

  const data = React.useMemo(
    () =>
      isSuccessPrescription &&
      dataPrescription?.data?.map(prescription => {
        return {
          id: prescription.id,
          drug_id: prescription.drug_id,
          drug_name: prescription.drug_name,
          quantity: prescription.quantity,
          unit: prescription.unit,
          frequency: prescription.frequency,
          description: prescription.description,
          eat: prescription.eat,
          routine: prescription.routine,
          start_at: prescription.start_at,
          end_at: prescription.end_at,
        };
      }),
    [isSuccessPrescription, dataPrescription?.data]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Drug Name',
        accessor: 'drug_name',
        // isNumeric: true,
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        // isNumeric: true,
      },
      {
        Header: 'Frequency',
        accessor: 'frequency',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Eat',
        accessor: 'eat',
      },
      {
        Header: 'Routine',
        accessor: 'routine',
        Cell: ({ value }) => {
          if (value) {
            return <Text>Yes</Text>;
          }
          return <Text>No</Text>;
        },
      },
      {
        Header: 'Start at',
        accessor: 'start_at',
        Cell: ({ value }) => {
          return new Date(value).toLocaleDateString();
          // return value.split("T")[0];
        },
      },
      {
        Header: 'End at',
        accessor: 'end_at',
        Cell: ({ value }) => {
          return new Date(value).toLocaleDateString();

          // return value.split("T")[0];
        },
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          return (
            <Button
              colorScheme="purple"
              variant="link"
              onClick={() => handleEdit(row.original.id)}
            >
              Edit
            </Button>
          );
        },
      },
    ],
    [handleEdit]
  );

  return (
    <>
      <AddPrescriptionModal
        isOpen={isOpenAddPrescriptionModal}
        onClose={onCloseAddPrescriptionModal}
        patientDetail={patientDetail}
        dataSoap={dataSoap}
        currentPrescriptions={dataPrescription?.data}
      />
      <EditPrescriptionDrawer
        isOpen={isOpenEditPrescriptionDrawer}
        onClose={onCloseEditPrescriptionDrawer}
        selectedPrescription={selectedPrescription}
        patientDetail={patientDetail}
        dataSoap={dataSoap}
      />
      <PrescriptionTable
        columns={columns}
        data={data || []}
        skeletonCols={9}
        isLoading={isLoadingPrescription}
        action={
          <Button
            onClick={onOpenAddPrescriptionModal}
            colorScheme="green"
            size="sm"
          >
            Add Prescription
          </Button>
        }
      />
    </>
  );
};
