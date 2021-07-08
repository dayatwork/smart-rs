/* eslint-disable react/display-name */
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  VStack,
  Button,
  useDisclosure,
  Text,
  Divider,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
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
import { getSoapLaboratoryResultList } from '../../../../../../api/laboratory-services/result';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../access-control';

export const Plan = ({ patientDetail, dataSoap }) => {
  const [cookies] = useCookies(['token']);

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

  const { data: dataLabResult, isSuccess: isSuccessLabResult } = useQuery(
    ['soap-lab-result', dataSoap?.id],
    () => getSoapLaboratoryResultList(cookies, dataSoap?.id)
    // { enabled: Boolean(dataSoap?.id) }
  );

  console.log({ dataSoap });
  console.log({ cookies });
  console.log({ dataLabResult });

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
        dataSoap={dataSoap}
      />

      <Box bg="white" boxShadow="md" p="4" overflow="auto">
        <VStack align="start" spacing="10">
          <Box px="4">
            <Heading fontSize="lg" fontWeight="semibold" mb="4">
              Procedure
            </Heading>
            <Stack direction={{ base: 'column', md: 'row' }}>
              <PrivateComponent
                permission={Permissions.createBookingLaboratory}
              >
                <Button
                  size="sm"
                  onClick={onOpenRequestLabModal}
                  colorScheme="green"
                >
                  Request Lab Test
                </Button>
              </PrivateComponent>
              <PrivateComponent permission={Permissions.createBookingRadiology}>
                <Button
                  size="sm"
                  onClick={onOpenRequestRadiologyModal}
                  colorScheme="green"
                >
                  Request Radiology Test
                </Button>
              </PrivateComponent>
              <PrivateComponent permission={Permissions.createBookingDoctor}>
                <Button
                  size="sm"
                  onClick={onOpenAppointmentModal}
                  colorScheme="green"
                >
                  Follow up Appointment
                </Button>
              </PrivateComponent>
            </Stack>
          </Box>
          <Divider />
          <PrivateComponent permission={Permissions.indexPrescription}>
            <Box w="full" px="4">
              <TablePrescription
                dataSoap={dataSoap}
                patientDetail={patientDetail}
              />
            </Box>
          </PrivateComponent>
        </VStack>
      </Box>

      <Box bg="white" boxShadow="md" p="4" overflow="auto" mt="4">
        <Box px="4">
          <Heading fontSize="lg" fontWeight="semibold" mb="4">
            Procedure Result
          </Heading>
          {isSuccessLabResult && dataLabResult?.data?.length ? (
            <>
              <Heading fontSize="md" fontWeight="semibold" mb="4">
                Lab Test Result
              </Heading>
              <Accordion allowMultiple>
                {dataLabResult?.data?.map((result, index) => {
                  console.log({ result });
                  return (
                    <AccordionItem key={result.id}>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            Lab Test {index + 1}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {result.bloods[0] &&
                        result.bloods[0]?.id &&
                        result.bloods[0]?.blood_results[0] ? (
                          <>
                            <Heading size="md" mb="2">
                              Result
                            </Heading>
                            <Box mb="4">
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color="gray.600"
                              >
                                Code
                              </Text>
                              <Text fontWeight="semibold">
                                {result.bloods[0].code}
                              </Text>
                              <Button
                                as={Link}
                                to={`/events/blood-test-result/${result.bloods[0]?.blood_results[0]?.id}`}
                                variant="link"
                                colorScheme="purple"
                              >
                                Details
                              </Button>
                            </Box>
                            <Table
                              variant="simple"
                              border="1px"
                              borderColor="gray.200"
                              mb="8"
                            >
                              <Thead>
                                <Tr>
                                  <Th>Pemeriksaan</Th>
                                  <Th isNumeric>Hasil</Th>
                                  <Th>Satuan</Th>
                                  <Th>Nilai Normal</Th>
                                  {/* <Th>Metode</Th> */}
                                </Tr>
                              </Thead>
                              <Tbody>
                                {result.bloods[0]?.blood_results[0]?.blood_result_details?.map(
                                  data => (
                                    <Tr key={data.id}>
                                      <Td>{data.name}</Td>
                                      <Td isNumeric>{data.result}</Td>
                                      <Td>{data.unit}</Td>
                                      <Td>{data.normal_result}</Td>
                                    </Tr>
                                  )
                                )}
                              </Tbody>
                            </Table>
                          </>
                        ) : null}
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </>
          ) : null}
        </Box>
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
            <PrivateComponent permission={Permissions.updatePrescription}>
              <Button
                colorScheme="purple"
                variant="link"
                onClick={() => handleEdit(row.original.id)}
              >
                Edit
              </Button>
            </PrivateComponent>
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
          <PrivateComponent permission={Permissions.createPrescription}>
            <Button
              onClick={onOpenAddPrescriptionModal}
              colorScheme="green"
              size="sm"
            >
              Add Prescription
            </Button>
          </PrivateComponent>
        }
      />
    </>
  );
};
