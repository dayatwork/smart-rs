import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  UnorderedList,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Checkbox,
  ModalFooter,
  useDisclosure,
  SimpleGrid,
  Center,
  Spinner,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';

import { getMedicalHistories } from '../../../../../../api/master-data-services/medical-histories';
import {
  getPatientMedicalHistories,
  updatePatientMedicalHistories,
} from '../../../../../../api/medical-record-services/medical-history';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../access-control';

export const MedicalHistory = ({ patientDetail }) => {
  const [cookies] = useCookies(['token']);

  const {
    isOpen: isOpenMedicalHistoryModal,
    onOpen: onOpenMedicalHistoryModal,
    onClose: onCloseMedicalHistoryModal,
  } = useDisclosure();

  const {
    data: resMedHistories,
    isSuccess: isSuccessMedHistories,
    isLoading: isLoadingMedHistories,
  } = useQuery(
    ['patient-medical-history', patientDetail?.patient_id],
    () => getPatientMedicalHistories(cookies, patientDetail?.patient_id),
    { enabled: Boolean(patientDetail?.patient_id), staleTime: Infinity }
  );

  return (
    <>
      <UpdateMedicalHistoryModal
        isOpen={isOpenMedicalHistoryModal}
        onClose={onCloseMedicalHistoryModal}
        patientDetail={patientDetail}
      />
      <Box p="4">
        <Flex
          justify="space-between"
          mb="2"
          align={{ base: 'stretch', md: 'center' }}
          flexDir={{ base: 'column', md: 'row' }}
        >
          <Heading
            as="h3"
            fontSize="xl"
            color="purple.500"
            mb={{ base: '2', md: '0' }}
          >
            Medical History
          </Heading>
          <PrivateComponent
            permission={Permissions.updatePatientMedicalHistory}
          >
            <Button
              onClick={onOpenMedicalHistoryModal}
              colorScheme="green"
              size="sm"
            >
              Update Medical History
            </Button>
          </PrivateComponent>
        </Flex>
        {isLoadingMedHistories && (
          <Center py="6">
            <Spinner />
          </Center>
        )}
        {isSuccessMedHistories && (
          <Box>
            <UnorderedList pl="5">
              {resMedHistories?.data.map(medHistory => (
                <ListItem key={medHistory.id}>{medHistory.name}</ListItem>
              ))}
            </UnorderedList>
          </Box>
        )}
        {isSuccessMedHistories && resMedHistories?.code === 404 && (
          <Center py="6">
            <Text>No medical history</Text>
          </Center>
        )}
      </Box>
    </>
  );
};

const UpdateMedicalHistoryModal = ({ isOpen, onClose, patientDetail }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const { register, handleSubmit, reset } = useForm();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const queryClient = useQueryClient();

  const { data: res } = useQuery(
    'master-medical-histories',
    () => getMedicalHistories(cookies),
    { staleTime: Infinity }
  );

  const { data: dataPatientMedHistories } = useQuery(
    ['patient-medical-history', patientDetail?.patient_id],
    () => getPatientMedicalHistories(cookies, patientDetail?.patient_id)
  );

  const onSubmit = async value => {
    const { medical_history } = value;
    // console.log({ medical_history });
    const formatted = medical_history
      .filter(med_history => med_history !== false)
      .map(med_history => JSON.parse(med_history));

    const data = {
      user_id: patientDetail?.patient?.user_id,
      patient_id: patientDetail?.patient_id,
      data: formatted,
    };

    // console.log({ data });

    try {
      setIsLoadingSubmit(true);
      await updatePatientMedicalHistories(cookies, data);
      await queryClient.invalidateQueries([
        'patient-medical-history',
        patientDetail?.patient_id,
      ]);
      setIsLoadingSubmit(false);
      reset({});
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Medical history berhasil di update`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      setIsLoadingSubmit(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Medical history gagal di update`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Medical History</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <SimpleGrid columns={4} gap="3">
              {res?.data.map((medicalHistory, index) => {
                const isCheck = dataPatientMedHistories?.data?.find(
                  medHistory =>
                    medHistory.medical_history_id === medicalHistory.id
                );

                return (
                  <Checkbox
                    key={medicalHistory.id}
                    colorScheme="red"
                    value={JSON.stringify({
                      medical_history_id: medicalHistory.id,
                      name: medicalHistory.name,
                    })}
                    defaultChecked={!!isCheck}
                    // disabled={Boolean(isCheck)}
                    // readOnly={Boolean(isCheck)}
                    // isDisabled={Boolean(isCheck)}
                    {...register(`medical_history[${index}]`)}
                  >
                    {medicalHistory.name}
                  </Checkbox>
                );
              })}
            </SimpleGrid>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            isLoading={isLoadingSubmit}
            colorScheme="green"
            onClick={handleSubmit(onSubmit)}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
