import React, { useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Input,
  useDisclosure,
  Stack,
  RadioGroup,
  Radio,
  Select,
  useToast,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';

import { getSymptoms } from '../../../../../../api/master-data-services/symptom';
import {
  getPatientSymptoms,
  createPatientSymptom,
  addPatientSymptom,
  deletePatientSymptom,
} from '../../../../../../api/medical-record-services/symptom';
import { editSoapSubjective } from '../../../../../../api/medical-record-services/soap';

import { Allergies } from './Allergies';
import { MedicalHistory } from './MedicalHistory';
import { FamilyHistory } from './FamilyHistory';
import { SocialHistory } from './SocialHistory';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../access-control';

export const Subjective = ({ soapSubjectives, patientDetail, userDetails }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingUpdatePatientComplaint, setIsLoadingUpdatePatientComplaint] =
    useState(false);
  const { handleSubmit, register } = useForm();
  const {
    isOpen: isOpenAddSymptomModal,
    onOpen: onOpenAddSymptomModal,
    onClose: onCloseAddSymptomModal,
  } = useDisclosure();
  const queryClient = useQueryClient();

  const { data: dataPatientSymptoms, isLoading: isLoadingPatientSymptoms } =
    useQuery(
      ['patient-symptoms', patientDetail?.patient_id, soapSubjectives[0]?.id],
      () =>
        getPatientSymptoms(
          cookies,
          patientDetail?.patient_id,
          soapSubjectives[0]?.id
        ),
      {
        enabled:
          Boolean(patientDetail?.patient_id) && Boolean(soapSubjectives[0]?.id),
        staleTime: Infinity,
      }
    );

  const handleDelete = async id => {
    try {
      const data = {
        id,
        patient_symptom_id: dataPatientSymptoms?.data?.id,
        patient_id: patientDetail?.patient_id,
        user_id: patientDetail?.patient?.user_id,
      };
      setIsLoadingDelete(true);
      await deletePatientSymptom(cookies, data);
      await queryClient.invalidateQueries([
        'patient-symptoms',
        patientDetail?.patient_id,
        soapSubjectives[0]?.id,
      ]);
      setIsLoadingDelete(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Symptom berhasil dihapus`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoadingDelete(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Symptom gagal dihapus`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const onSubmitPatientComplaint = async value => {
    try {
      const data = {
        id: soapSubjectives[0]?.id,
        patient_complaint: value.patient_complaint,
      };
      setIsLoadingUpdatePatientComplaint(true);
      // await deletePatientSymptom(cookies, data);
      await editSoapSubjective(cookies)(data);
      // await queryClient.invalidateQueries([
      //   "patient-symptoms",
      //   patientDetail?.patient_id,
      //   soapSubjectives[0]?.id,
      // ]);
      setIsLoadingUpdatePatientComplaint(false);
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Patient complaint updated`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoadingUpdatePatientComplaint(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Error update patient complaint`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <AddSymptomModal
        isOpen={isOpenAddSymptomModal}
        onClose={onCloseAddSymptomModal}
        patientDetail={patientDetail}
        soapSubjectives={soapSubjectives}
        patientSymptomId={dataPatientSymptoms?.data?.id}
      />
      <Box bg="white" p="4" boxShadow="md" overflow="auto">
        {/* <MedicalRoutine />
        <Divider my="6" /> */}
        <PrivateComponent permission={Permissions.indexPatientAllergy}>
          <Allergies patientDetail={patientDetail} />
        </PrivateComponent>
        <Divider my="6" />
        <PrivateComponent permission={Permissions.indexPatientMedicalHistory}>
          <MedicalHistory patientDetail={patientDetail} />
        </PrivateComponent>
        <Divider my="6" />
        <PrivateComponent permission={Permissions.indexPatientFamilyHistory}>
          <FamilyHistory patientDetail={patientDetail} />
        </PrivateComponent>
        <Divider my="6" />
        <PrivateComponent permission={Permissions.indexPatientSocialHistory}>
          <SocialHistory
            patientDetail={patientDetail}
            userDetails={userDetails}
          />
        </PrivateComponent>
        <Divider my="6" />

        <Box px="4" maxW="xl">
          <FormControl id="complaint">
            <FormLabel>{`Patient's complaint`}</FormLabel>
            <Textarea rows="6" {...register('patient_complaint')} />
            <Button
              size="sm"
              onClick={handleSubmit(onSubmitPatientComplaint)}
              isLoading={isLoadingUpdatePatientComplaint}
            >
              Save
            </Button>
          </FormControl>
        </Box>
        <Divider my="6" />
        <PrivateComponent permission={Permissions.indexPatientSymptom}>
          <Box mb="4" py="4">
            <Flex
              justify="space-between"
              px="4"
              mb="3"
              align={{ base: 'stretch', md: 'center' }}
              flexDir={{ base: 'column', md: 'row' }}
            >
              <Heading
                as="h3"
                fontSize="xl"
                color="purple.500"
                mb={{ base: '2', md: '0' }}
              >
                Symptom
              </Heading>
              <PrivateComponent permission={Permissions.createPatientSymptom}>
                <Button
                  onClick={onOpenAddSymptomModal}
                  colorScheme="green"
                  leftIcon={<FaPlus />}
                  size="sm"
                >
                  Add Symptom
                </Button>
              </PrivateComponent>
            </Flex>
            <Box px="4">
              {isLoadingPatientSymptoms && (
                <Center py="6">
                  <Spinner />
                </Center>
              )}
              <Accordion
                defaultIndex={[0]}
                allowMultiple
                border="1px"
                borderColor="gray.200"
              >
                {dataPatientSymptoms?.data?.patient_symptom_details?.map(
                  symptom => (
                    <AccordionItem key={symptom?.id}>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            {symptom?.symptom_name}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Description
                          title="Symptom"
                          value={symptom?.symptom_name}
                        />
                        <Description title="Onset" value={symptom?.onset} />
                        <Description
                          title="Location"
                          value={symptom?.location}
                        />
                        <Description
                          title="Duration"
                          value={symptom?.duration}
                        />
                        <Description
                          title="Characterization"
                          value={symptom?.characterization}
                        />
                        <Description
                          title="Alleviating & Aggravating Factors"
                          value={symptom?.alleviating_and_aggravating_factors}
                        />
                        <Description
                          title="Radiation"
                          value={symptom?.radiation}
                        />
                        <Description
                          title="Temporal Factor"
                          value={symptom?.temporal_factor}
                        />
                        <Description
                          title="Severity"
                          value={symptom?.severity}
                        />
                        <PrivateComponent
                          permission={Permissions.deletePatientSymptom}
                        >
                          <Flex justify="flex-end" mt="2">
                            <Button
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              isLoading={isLoadingDelete}
                              onClick={() => handleDelete(symptom.id)}
                            >
                              Delete
                            </Button>
                          </Flex>
                        </PrivateComponent>
                      </AccordionPanel>
                    </AccordionItem>
                  )
                )}
              </Accordion>
            </Box>
          </Box>
        </PrivateComponent>
      </Box>
    </>
  );
};

const AddSymptomModal = ({
  isOpen,
  onClose,
  patientDetail,
  soapSubjectives,
  patientSymptomId,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [severity, setSeverity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors } = useForm();

  const { data: dataSymptoms } = useQuery(
    'master-symptoms',
    () => getSymptoms(cookies),
    {
      staleTime: Infinity,
    }
  );

  const queryClient = useQueryClient();

  const { mutate: createSymptomMutate } = useMutation(
    createPatientSymptom(cookies),
    {
      onMutate: () => {
        setIsLoading(true);
      },
      onSettled: async (data, error) => {
        setIsLoading(false);
        onClose();
        if (data) {
          await queryClient.invalidateQueries([
            'patient-symptoms',
            patientDetail?.patient_id,
            soapSubjectives[0]?.id,
          ]);
          setErrMessage('');
          reset();
          clearErrors();
          toast({
            position: 'top-right',
            title: 'Success',
            description: `Symptom berhasil ditambahkan`,
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        }

        if (error) {
          setErrMessage(error.message || 'Error');
        }
      },
      onError: () => {
        // mutation error
      },
      onSuccess: () => {
        // mutation success
      },
    }
  );

  const { mutate: addSymptomMutate } = useMutation(addPatientSymptom(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'patient-symptoms',
          patientDetail?.patient_id,
          soapSubjectives[0]?.id,
        ]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Symptom berhasil ditambahkan`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }

      if (error) {
        setErrMessage(error.message || 'Error');
      }
    },
    onError: () => {
      // mutation error
    },
    onSuccess: () => {
      // mutation success
    },
  });

  const onSubmit = async value => {
    const {
      symptom,
      onset,
      location,
      duration,
      characterization,
      alleviating_and_aggravating_factors,
      radiation,
      temporal_factor,
    } = value;
    const data = {
      symptom_id: JSON.parse(symptom)?.id,
      symptom_name: JSON.parse(symptom)?.name,
      onset,
      location,
      duration,
      characterization,
      alleviating_and_aggravating_factors,
      radiation,
      temporal_factor,
      severity,
    };

    if (!patientSymptomId) {
      const payload = {
        subjective_id: soapSubjectives[0]?.id,
        user_id: patientDetail?.patient?.user_id,
        patient_id: patientDetail?.patient_id,
        data: [data],
      };
      await createSymptomMutate(payload);
    } else {
      const payload = {
        patient_symptom_id: patientSymptomId,
        user_id: patientDetail?.patient?.user_id,
        patient_id: patientDetail?.patient_id,
        data: [data],
      };
      await addSymptomMutate(payload);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Symptom</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" id="symptom">
            <FormLabel>Symptom</FormLabel>
            <Select {...register('symptom', { required: 'Select symptom' })}>
              <option value="">Select symptom</option>
              {dataSymptoms?.data?.map(symptom => (
                <option
                  key={symptom.id}
                  value={JSON.stringify({ id: symptom.id, name: symptom.name })}
                  // value={symptom.id}
                >
                  {symptom.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb="4" id="onset">
            <FormLabel>Onset</FormLabel>
            <Input {...register('onset')} />
          </FormControl>
          <FormControl mb="4" id="location">
            <FormLabel>Location</FormLabel>
            <Input {...register('location')} />
          </FormControl>
          <FormControl mb="4" id="duration">
            <FormLabel>Duration</FormLabel>
            <Input {...register('duration')} />
          </FormControl>
          <FormControl mb="4" id="characterization">
            <FormLabel>Characterization</FormLabel>
            <Input {...register('characterization')} />
          </FormControl>
          <FormControl mb="4" id="alleviatingAndAggravatingFactors">
            <FormLabel>Alleviating & Aggravating Factors</FormLabel>
            <Input {...register('alleviating_and_aggravating_factors')} />
          </FormControl>
          <FormControl mb="4" id="radiation">
            <FormLabel>Radiation</FormLabel>
            <Input {...register('radiation')} />
          </FormControl>
          <FormControl mb="4" id="temporalFactor">
            <FormLabel>Temporal Factor</FormLabel>
            <Input {...register('temporal_factor')} />
          </FormControl>
          <FormControl mb="4" id="severity">
            <FormLabel>Severity</FormLabel>
            <RadioGroup onChange={setSeverity} value={severity}>
              <Stack direction="row" spacing={10}>
                <Radio value="0">0</Radio>
                <Radio value="2">2</Radio>
                <Radio value="4">4</Radio>
                <Radio value="6">6</Radio>
                <Radio value="8">8</Radio>
                <Radio value="10">10</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <PrivateComponent permission={Permissions.createPatientSymptom}>
            <Button
              colorScheme="green"
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
            >
              Create
            </Button>
          </PrivateComponent>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Description = ({ title, value, ...props }) => {
  return (
    <Flex
      as="dl"
      direction={{ base: 'column', sm: 'row' }}
      // px="6"
      py="1"
      // _even="gray.50"
      _even={{ bgColor: 'gray.100' }}
      {...props}
    >
      <Box as="dt" flexBasis="35%" color="gray.600">
        {title}
      </Box>
      <Box as="dd" flex="1">
        {value}
      </Box>
    </Flex>
  );
};
