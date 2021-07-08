import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';

import { getHospitalPatientById } from '../../../../../api/patient-services/hospital-patient';
import { getUsersByIdentity } from '../../../../../api/user-services/user-management';
import { updateSoapStatus } from '../../../../../api/medical-record-services/soap';
// import { getLaboratoryBloodList } from '../../../../../api/laboratory-services/blood';

import { Subjective } from './soap/Subjective';
import { Objective } from './soap/Objective';
import { Assesment } from './soap/Assessment';
import { Plan } from './soap/Plan';
import { SoapHistory } from './soap/SoapHistory';
import { PrivateComponent, Permissions } from '../../../../../access-control';

export const Soap = ({ dataSoap }) => {
  const [cookies] = useCookies(['token']);
  const [selectedSoapTemplate, setSelectedSoapTemplate] = useState(
    'general-practitioners'
  );

  const {
    isOpen: isOpenCompleteSOAP,
    onClose: onCloseCompleteSOAP,
    onOpen: onOpenCompleteSOAP,
  } = useDisclosure();

  const {
    data: dataPatientDetail,
    // isLoading: isLoadingPatientDetail,
    // isSuccess: isSuccessPatientDetail,
  } = useQuery(
    ['hospital-patients', dataSoap.institution_id, dataSoap.patient_id],
    () =>
      getHospitalPatientById(cookies, {
        institution_id: dataSoap.institution_id,
        patient_id: dataSoap.patient_id,
      }),
    {
      enabled: Boolean(dataSoap.institution_id) && Boolean(dataSoap.patient_id),
    }
  );

  const { data: dataUserDetails } = useQuery(
    ['user-details', dataPatientDetail?.data?.patient?.email],
    () => getUsersByIdentity(cookies, dataPatientDetail?.data?.patient?.email),
    { enabled: Boolean(dataPatientDetail?.data?.patient?.email) }
  );

  // const { data: dataLabPatient } = useQuery(
  //   ['lab-patient-data', dataSoap?.institution_id, dataSoap?.id],
  //   () =>
  //     getLaboratoryBloodList(cookies, dataSoap?.institution_id, dataSoap?.id),
  //   {
  //     enabled: Boolean(dataSoap?.institution_id) && Boolean(dataSoap?.id),
  //   }
  // );

  // console.log({ dataLabPatient });

  if (dataSoap?.status === 'completed') {
    return <Redirect to="/events/examination" />;
  }

  return (
    <>
      {/* bgColor="white" */}
      <ConfirmCompleteSOAP
        isOpen={isOpenCompleteSOAP}
        onClose={onCloseCompleteSOAP}
        dataSOAP={dataSoap}
      />
      <Flex justify="space-between">
        <Flex
          p="10"
          align={{ base: 'baseline', md: 'center' }}
          justify="space-between"
          bg="white"
          boxShadow="md"
          direction={{ base: 'column', md: 'row' }}
          mb="8"
          // minW="2xl"
        >
          <Flex
            align="center"
            px={{ base: '0', '2xl': '4' }}
            mb={{ base: '4', lg: '0' }}
          >
            <Avatar
              size="xl"
              name="Segun Adebayo"
              src="https://bit.ly/broken-link"
              mr={{ base: '8', '2xl': '10' }}
            />
            <Box>
              <Text fontSize="2xl" fontWeight="bold">
                {dataPatientDetail?.data?.patient?.name}
              </Text>
              <Text fontWeight="semibold" color="gray.600">
                Patient ID: {dataPatientDetail?.data?.patient_id}
              </Text>
            </Box>
          </Flex>
          {/* <Box>
            <Text fontSize="lg" fontWeight="semibold">
              Patient ID
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="purple.500">
              {dataPatientDetail?.data?.patient_id}
            </Text>
          </Box> */}
        </Flex>
        {/* <Box>
          <Button colorScheme="purple">SOAP History</Button>
        </Box> */}
      </Flex>

      {/* SOAP History */}
      <Box mb="8">
        <Heading fontSize="lg" mb="2">
          SOAP History
        </Heading>
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Open Soap History
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel py="6">
              <SoapHistory
                patientId={dataSoap?.patient_id}
                institutionId={dataSoap.institution_id}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      <Box>
        <Heading fontSize="lg" mb="2">
          New SOAP
        </Heading>
        <HStack mb="10">
          <Select
            maxW="sm"
            mr="4"
            value={selectedSoapTemplate}
            onChange={e => setSelectedSoapTemplate(e.target.value)}
          >
            <option value="">Select SOAP Template</option>
            <option value="general-practitioners">General Practitioners</option>
          </Select>
          <Flex as="span" h="14" align="center">
            <Flex
              as="span"
              position="relative"
              zIndex="10"
              w="12"
              h="12"
              align="center"
              justify="center"
              bgColor="green.500"
              rounded="full"
              className="group-hover:bg-indigo-800"
            >
              <Box color="white" fontWeight="bold" fontSize="2xl">
                S
              </Box>
            </Flex>
          </Flex>
          <Flex as="span" h="14" align="center">
            <Flex
              as="span"
              position="relative"
              zIndex="10"
              w="12"
              h="12"
              align="center"
              justify="center"
              bgColor="yellow.500"
              rounded="full"
              className="group-hover:bg-indigo-800"
            >
              <Box color="white" fontWeight="bold" fontSize="2xl">
                O
              </Box>
            </Flex>
          </Flex>
          <Flex as="span" h="14" align="center">
            <Flex
              as="span"
              position="relative"
              zIndex="10"
              w="12"
              h="12"
              align="center"
              justify="center"
              bgColor="pink.500"
              rounded="full"
              className="group-hover:bg-indigo-800"
            >
              <Box color="white" fontWeight="bold" fontSize="2xl">
                A
              </Box>
            </Flex>
          </Flex>
          <Flex as="span" h="14" align="center">
            <Flex
              as="span"
              position="relative"
              zIndex="10"
              w="12"
              h="12"
              align="center"
              justify="center"
              bgColor="blue.500"
              rounded="full"
              className="group-hover:bg-indigo-800"
            >
              <Box color="white" fontWeight="bold" fontSize="2xl">
                P
              </Box>
            </Flex>
          </Flex>
          {/* <Flex as="span" h="14" align="center">
            <Flex
              as="span"
              position="relative"
              zIndex="10"
              w="12"
              h="12"
              align="center"
              justify="center"
              bgColor="purple.500"
              rounded="full"
              className="group-hover:bg-indigo-800"
            >
              <Box color="white" fontWeight="bold" fontSize="2xl">
                M
              </Box>
            </Flex>
          </Flex> */}
        </HStack>
      </Box>

      {selectedSoapTemplate && (
        <Box pb="10">
          <Flex px={{ base: '4', sm: '6', lg: '8' }} py="2">
            <Box minW="0" w="full">
              <Box as="nav" aria-label="Progress">
                <Box as="ol" overflow="hidden">
                  {/* Complete Step */}
                  <Box as="li" position="relative" pb="10">
                    <Box
                      ml="-px"
                      position="absolute"
                      mt="0.5"
                      top="4"
                      left="6"
                      w="0.5"
                      h="full"
                      bgColor="gray.300"
                      aria-hidden="true"
                    ></Box>
                    <Flex
                      // as={Link}
                      // to="/"
                      position="relative"
                      align="start"
                      className="group"
                    >
                      <Flex as="span" h="14" align="center">
                        <Flex
                          as="span"
                          position="relative"
                          zIndex="10"
                          w="12"
                          h="12"
                          align="center"
                          justify="center"
                          bgColor="green.500"
                          rounded="full"
                          className="group-hover:bg-indigo-800"
                        >
                          <Box color="white" fontWeight="bold" fontSize="2xl">
                            S
                          </Box>
                        </Flex>
                      </Flex>
                      <Flex
                        as="span"
                        ml="4"
                        minW="0"
                        direction="column"
                        align="stretch"
                        w="full"
                      >
                        <Box
                          as="span"
                          fontSize="md"
                          fontWeight="semibold"
                          letterSpacing="0.025em"
                          textTransform="uppercase"
                        >
                          Subjective (S)
                        </Box>
                        <Box as="span" fontSize="sm" color="gray.500">
                          Vitae sed mi luctus laoreet.
                        </Box>
                        <Box mt="4">
                          <Subjective
                            patientId={dataPatientDetail?.data?.id}
                            soapSubjectives={dataSoap?.soap_subjectives}
                            patientDetail={dataPatientDetail?.data}
                            userDetails={dataUserDetails?.data}
                          />
                        </Box>
                      </Flex>
                    </Flex>
                  </Box>

                  {/* Current Step */}
                  <Box as="li" position="relative" pb="10">
                    <Box
                      ml="-px"
                      position="absolute"
                      mt="0.5"
                      top="4"
                      left="6"
                      w="0.5"
                      h="full"
                      bgColor="gray.300"
                      aria-hidden="true"
                    ></Box>
                    <Flex
                      // as={Link}
                      // to="/"
                      position="relative"
                      align="start"
                      className="group"
                    >
                      <Flex as="span" h="14" align="center">
                        <Flex
                          as="span"
                          position="relative"
                          zIndex="10"
                          w="12"
                          h="12"
                          align="center"
                          justify="center"
                          bgColor="yellow.500"
                          rounded="full"
                          className="group-hover:bg-indigo-800"
                        >
                          <Box color="white" fontWeight="bold" fontSize="2xl">
                            O
                          </Box>
                        </Flex>
                      </Flex>
                      <Flex
                        as="span"
                        ml="4"
                        minW="0"
                        direction="column"
                        align="stretch"
                        w="full"
                      >
                        <Box
                          as="span"
                          fontSize="md"
                          fontWeight="semibold"
                          letterSpacing="0.025em"
                          textTransform="uppercase"
                        >
                          Objective (O)
                        </Box>
                        <Box as="span" fontSize="sm" color="gray.500">
                          Vitae sed mi luctus laoreet.
                        </Box>
                        <Box mt="4">
                          <Objective
                            soapId={dataSoap?.id}
                            patientId={dataPatientDetail?.data?.id}
                            // patientId={dataUserDetails?.data?.id}
                            patientDetail={dataPatientDetail?.data}
                            soapObjectives={dataSoap?.soap_objectives}
                            userDetail={dataUserDetails?.data}
                          />
                        </Box>
                      </Flex>
                    </Flex>
                  </Box>

                  <Box as="li" position="relative" pb="10">
                    <Box
                      ml="-px"
                      position="absolute"
                      mt="0.5"
                      top="4"
                      left="6"
                      w="0.5"
                      h="full"
                      bgColor="gray.300"
                      aria-hidden="true"
                    ></Box>
                    <Flex
                      // as={Link}
                      // to="/"
                      position="relative"
                      align="start"
                      className="group"
                    >
                      <Flex as="span" h="14" align="center">
                        <Flex
                          as="span"
                          position="relative"
                          zIndex="10"
                          w="12"
                          h="12"
                          align="center"
                          justify="center"
                          bgColor="pink.500"
                          rounded="full"
                          className="group-hover:bg-indigo-800"
                        >
                          <Box color="white" fontWeight="bold" fontSize="2xl">
                            A
                          </Box>
                        </Flex>
                      </Flex>
                      <Flex
                        as="span"
                        ml="4"
                        minW="0"
                        direction="column"
                        align="stretch"
                        w="full"
                      >
                        <Box
                          as="span"
                          fontSize="md"
                          fontWeight="semibold"
                          letterSpacing="0.025em"
                          textTransform="uppercase"
                        >
                          Assessment (A)
                        </Box>
                        <Box as="span" fontSize="sm" color="gray.500">
                          Vitae sed mi luctus laoreet.
                        </Box>
                        <Box mt="4">
                          <Assesment
                            soapId={dataSoap?.id}
                            patientId={dataPatientDetail?.data?.id}
                            // patientId={dataUserDetails?.data?.id}
                            patientDetail={dataPatientDetail?.data}
                            soapAssessments={dataSoap?.soap_assessments}
                          />
                        </Box>
                      </Flex>
                    </Flex>
                  </Box>

                  <Box as="li" position="relative" pb="10">
                    {/* <Box
                      ml="-px"
                      position="absolute"
                      mt="0.5"
                      top="4"
                      left="6"
                      w="0.5"
                      h="full"
                      bgColor="gray.300"
                      aria-hidden="true"
                    ></Box> */}
                    <Flex
                      // as={Link}
                      // to="/"
                      position="relative"
                      align="start"
                      className="group"
                    >
                      <Flex as="span" h="14" align="center">
                        <Flex
                          as="span"
                          position="relative"
                          zIndex="10"
                          w="12"
                          h="12"
                          align="center"
                          justify="center"
                          bgColor="blue.500"
                          rounded="full"
                          className="group-hover:bg-indigo-800"
                        >
                          <Box color="white" fontWeight="bold" fontSize="2xl">
                            P
                          </Box>
                        </Flex>
                      </Flex>
                      <Flex
                        as="span"
                        ml="4"
                        minW="0"
                        direction="column"
                        align="stretch"
                        w="full"
                      >
                        <Box
                          as="span"
                          fontSize="md"
                          fontWeight="semibold"
                          letterSpacing="0.025em"
                          textTransform="uppercase"
                        >
                          Plan (P)
                        </Box>
                        <Box as="span" fontSize="sm" color="gray.500">
                          Vitae sed mi luctus laoreet.
                        </Box>
                        <Box mt="4">
                          <Plan
                            soapId={dataSoap?.id}
                            patientId={dataPatientDetail?.data?.id}
                            // patientId={dataUserDetails?.data?.id}
                            patientDetail={dataPatientDetail?.data}
                            soapPlans={dataSoap?.soap_plans}
                            dataSoap={dataSoap}
                            // dataLabPatient={dataLabPatient}
                          />
                        </Box>
                      </Flex>
                    </Flex>
                  </Box>

                  {/* <Box as="li" position="relative" pb="10">
                    <Flex
                      position="relative"
                      align="start"
                      className="group"
                    >
                      <Flex as="span" h="14" align="center">
                        <Flex
                          as="span"
                          position="relative"
                          zIndex="10"
                          w="12"
                          h="12"
                          align="center"
                          justify="center"
                          bgColor="purple.500"
                          rounded="full"
                          className="group-hover:bg-indigo-800"
                        >
                          <Box color="white" fontWeight="bold" fontSize="2xl">
                            M
                          </Box>
                        </Flex>
                      </Flex>
                      <Flex
                        as="span"
                        ml="4"
                        minW="0"
                        direction="column"
                        align="stretch"
                        w="full"
                      >
                        <Box
                          as="span"
                          fontSize="md"
                          fontWeight="semibold"
                          letterSpacing="0.025em"
                          textTransform="uppercase"
                        >
                          Medication (M)
                        </Box>
                        <Box as="span" fontSize="sm" color="gray.500">
                          Vitae sed mi luctus laoreet.
                        </Box>
                        <Box mt="4">
                          <Medication />
                        </Box>
                      </Flex>
                    </Flex>
                  </Box> */}
                </Box>
              </Box>
            </Box>
          </Flex>
          <PrivateComponent
            permission={Permissions['make-completeExamination']}
          >
            <Box textAlign="right" px={{ base: '4', sm: '6', lg: '8' }}>
              <Button colorScheme="purple" onClick={onOpenCompleteSOAP}>
                Complete SOAP
              </Button>
            </Box>
          </PrivateComponent>
        </Box>
      )}
    </>
  );
};

export const ConfirmCompleteSOAP = ({ isOpen, onClose, dataSOAP }) => {
  const history = useHistory();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleCheckIn = async () => {
    const data = {
      id: dataSOAP?.id,
      status: 'completed',
    };

    try {
      setIsLoading(true);
      await updateSoapStatus(cookies, data);
      await queryClient.invalidateQueries([
        'soap-list',
        'process',
        dataSOAP?.institution_id,
      ]);
      await queryClient.invalidateQueries([
        'soap-list',
        'completed',
        dataSOAP?.institution_id,
      ]);
      setIsLoading(false);
      onClose();
      toast({
        position: 'top-right',
        title: 'Success',
        description: `SOAP Completed`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      history.replace('/events/examination/history');
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Error complete SOAP`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Complete SOAP</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Apakah anda ingin mengakhiri pengisian SOAP</ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            // disabled={!name}
            colorScheme="purple"
            onClick={handleCheckIn}
            isLoading={isLoading}
          >
            Complete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
