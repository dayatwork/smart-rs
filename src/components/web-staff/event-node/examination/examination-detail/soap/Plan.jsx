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
  Badge,
  SimpleGrid,
  Image,
} from '@chakra-ui/react';
import 'react-day-picker/lib/style.css';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import Lightbox from 'react-image-lightbox';

import { PrescriptionTable } from './plan/PrescriptionTable';
import { RequestLabTestModal } from './plan/RequestLabTestModal';
import { RequestRadiologyTestModal } from './plan/RequestRadiologyTestModal';
import { AddPrescriptionModal } from './plan/AddPrescriptionModal';
import { EditPrescriptionDrawer } from './plan/EditPrescriptionDrawer';
import { AppointmentModal } from './plan/AppointmentModal';
import { getPatientPrescription } from '../../../../../../api/medical-record-services/soap';
import { getSoapLaboratoryResultList } from '../../../../../../api/laboratory-services/result';
import { getSoapRadiologyResultList } from '../../../../../../api/radiology-services/result';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../access-control';

export const Plan = ({ patientDetail, dataSoap }) => {
  const [cookies] = useCookies(['token']);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

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
    () =>
      getSoapLaboratoryResultList(
        cookies,
        dataSoap?.id,
        patientDetail?.patient_id
      ),
    { enabled: Boolean(dataSoap?.id) && Boolean(patientDetail?.patient_id) }
  );

  const { data: dataRadiologyResult, isSuccess: isSuccessRadiologyResult } =
    useQuery(
      ['soap-radiology-result', dataSoap?.id],
      () =>
        getSoapRadiologyResultList(
          cookies,
          dataSoap?.id,
          patientDetail?.patient_id
        ),
      { enabled: Boolean(dataSoap?.id) && Boolean(patientDetail?.patient_id) }
    );

  // console.log({ dataSoap });
  // console.log({ cookies });
  console.log({ dataLabResult });
  console.log({ dataRadiologyResult });
  console.log({ patientDetail });

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
            <Box mt="10">
              <Heading fontSize="md" fontWeight="semibold" mb="4">
                Lab Test Result
              </Heading>
              <Accordion allowMultiple>
                {dataLabResult?.data?.map((result, index) => {
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
                        {result?.blood_result_details?.length ? (
                          <Box p="4">
                            <Heading size="sm" mb="2">
                              Info
                            </Heading>
                            <Box
                              mb="4"
                              w="xs"
                              p="4"
                              boxShadow="md"
                              rounded="md"
                              border="1px"
                              borderColor="gray.200"
                            >
                              <SimpleGrid columns={2}>
                                <Text
                                  // fontSize="sm"
                                  fontWeight="semibold"
                                  color="gray.600"
                                >
                                  Code
                                </Text>
                                <Text fontWeight="semibold">
                                  {result?.blood?.code}
                                </Text>
                              </SimpleGrid>
                              <SimpleGrid columns={2}>
                                <Text
                                  // fontSize="sm"
                                  fontWeight="semibold"
                                  color="gray.600"
                                >
                                  Status
                                </Text>
                                <Box>
                                  <Badge display="inline-block">
                                    {result?.status}
                                  </Badge>
                                </Box>
                              </SimpleGrid>
                              <Button
                                as={Link}
                                to={`/events/blood-test-result/${result.id}`}
                                variant="link"
                                colorScheme="purple"
                              >
                                Details
                              </Button>
                            </Box>
                            <Heading size="sm" mb="2">
                              Result
                            </Heading>
                            <Table
                              variant="simple"
                              border="1px"
                              borderColor="gray.200"
                              mb="8"
                              boxShadow="md"
                              rounded="md"
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
                                {result?.blood_result_details?.map(data => (
                                  <Tr key={data?.id}>
                                    <Td>{data?.subcategory?.name}</Td>
                                    <Td isNumeric>{data?.result}</Td>
                                    <Td>{data?.unit}</Td>
                                    <Td>{data?.normal_result}</Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </Box>
                        ) : null}
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Box>
          ) : null}
          {isSuccessRadiologyResult && dataRadiologyResult?.data?.length ? (
            <Box mt="10">
              <Heading fontSize="md" fontWeight="semibold" mb="4">
                Radiology Test Result
              </Heading>
              {isOpenImage && selectedImage && (
                <Lightbox
                  mainSrc={`${process.env.REACT_APP_UPLOADED_FILE_URL}/${selectedImage}`}
                  onCloseRequest={() => setIsOpenImage(false)}
                />
              )}
              <Accordion allowMultiple>
                {dataRadiologyResult?.data?.map((result, index) => {
                  return (
                    <AccordionItem key={result.id}>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            Radiology Test {index + 1}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {result?.result?.length ? (
                          <Box p="4">
                            <Heading size="sm" mb="2">
                              Info
                            </Heading>
                            <Box
                              mb="4"
                              w="xs"
                              p="4"
                              boxShadow="md"
                              rounded="md"
                              border="1px"
                              borderColor="gray.200"
                            >
                              <SimpleGrid columns={2}>
                                <Text
                                  // fontSize="sm"
                                  fontWeight="semibold"
                                  color="gray.600"
                                >
                                  Status
                                </Text>
                                <Box>
                                  <Badge display="inline-block">
                                    {result?.status}
                                  </Badge>
                                </Box>
                              </SimpleGrid>
                              <Button
                                as={Link}
                                to={`/events/blood-test-result/${result.id}`}
                                variant="link"
                                colorScheme="purple"
                              >
                                Details
                              </Button>
                            </Box>
                            {result?.result?.map((data, index) => (
                              <Box>
                                <Heading size="sm" mb="2">
                                  Result {index > 0 ? index + 1 : null}
                                </Heading>
                                <Box
                                  mb="4"
                                  p="4"
                                  rounded="md"
                                  boxShadow="md"
                                  border="1px"
                                  borderColor="gray.200"
                                >
                                  <Box mb="4">
                                    <Text fontWeight="semibold" mb="1">
                                      Description
                                    </Text>
                                    <Text>{data.description}</Text>
                                  </Box>
                                  <Box>
                                    <Text fontWeight="semibold" mb="1">
                                      Image
                                    </Text>
                                    <Image
                                      onClick={() => {
                                        setSelectedImage(data.image);
                                        setIsOpenImage(true);
                                      }}
                                      _hover={{ opacity: 0.7 }}
                                      cursor="pointer"
                                      boxSize="150px"
                                      objectFit="cover"
                                      src={`${process.env.REACT_APP_UPLOADED_FILE_URL}/${data.image}`}
                                      alt="Imaging Result"
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        ) : null}
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Box>
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
