import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  UnorderedList,
  ListItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Checkbox,
  ModalFooter,
  SimpleGrid,
  Center,
  Spinner,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';

import { getFamilyHistories } from '../../../../../../api/master-data-services/family-histories';
import {
  getPatientFamilyHistories,
  updatePatientFamilyHistories,
} from '../../../../../../api/medical-record-services/family-history';

export const FamilyHistory = ({ patientDetail }) => {
  const [cookies] = useCookies(['token']);

  const {
    isOpen: isOpenFamilyHistoryModal,
    onOpen: onOpenFamilyHistoryModal,
    onClose: onCloseFamilyHistoryModal,
  } = useDisclosure();

  const {
    data: resFamHistories,
    isSuccess: isSuccessFamHistories,
    isLoading: isLoadingFamHistories,
  } = useQuery(
    ['patient-family-history', patientDetail?.patient_id],
    () => getPatientFamilyHistories(cookies, patientDetail?.patient_id),
    { enabled: Boolean(patientDetail?.patient_id), staleTime: Infinity },
  );

  return (
    <>
      <UpdateFamilyHistoryModal
        isOpen={isOpenFamilyHistoryModal}
        onClose={onCloseFamilyHistoryModal}
        patientDetail={patientDetail}
      />
      <Box p="4">
        <Flex justify="space-between" align="center" mb="2">
          <Heading as="h3" fontSize="xl" color="purple.500">
            Family History
          </Heading>
          <Button onClick={onOpenFamilyHistoryModal} colorScheme="green" size="sm">
            Update Family History
          </Button>
        </Flex>
        {isLoadingFamHistories && (
          <Center py="6">
            <Spinner />
          </Center>
        )}
        {isSuccessFamHistories && (
          <Box>
            <UnorderedList pl="5">
              {resFamHistories?.data.map((famHistory) => (
                <ListItem key={famHistory.id}>{famHistory.family_history_name}</ListItem>
              ))}
            </UnorderedList>
          </Box>
        )}
        {isSuccessFamHistories && resFamHistories?.code === 404 && (
          <Center py="6">
            <Text>No family history</Text>
          </Center>
        )}
      </Box>
    </>
  );
};

const UpdateFamilyHistoryModal = ({ isOpen, onClose, patientDetail }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm();
  const queryClient = useQueryClient();

  const { data: res } = useQuery(
    'master-family-histories',
    () => getFamilyHistories(cookies),
    { staleTime: Infinity },
  );

  const { data: dataPatientFamHistories } = useQuery(
    ['patient-family-history', patientDetail?.patient_id],
    () => getPatientFamilyHistories(cookies, patientDetail?.patient_id),
    { enabled: Boolean(patientDetail?.patient_id), staleTime: Infinity },
  );

  const onSubmit = async (value) => {
    const { family_history } = value;
    const formatted = family_history
      .filter((fam_history) => fam_history !== false)
      .map((fam_history) => JSON.parse(fam_history));

    const data = {
      user_id: patientDetail?.patient?.user_id,
      patient_id: patientDetail?.patient_id,
      data: formatted,
    };

    try {
      await updatePatientFamilyHistories(cookies, data);
      await queryClient.invalidateQueries([
        'patient-family-history',
        patientDetail?.patient_id,
      ]);
      reset({});
      toast({
        title: 'Success',
        description: `Family history berhasil di update`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Family history gagal di update`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Family History</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <SimpleGrid columns={3} gap="3">
              {res?.data.map((familyHistory, index) => {
                const isCheck = dataPatientFamHistories?.data?.find(
                  (famHistory) => famHistory.family_history_id === familyHistory.id,
                );
                return (
                  <Checkbox
                    key={familyHistory.id}
                    colorScheme="red"
                    value={JSON.stringify({
                      family_history_id: familyHistory.id,
                      family_history_name: familyHistory.name,
                    })}
                    defaultChecked={!!isCheck}
                    isDisabled={Boolean(isCheck)}
                    {...register(`family_history[${index}]`)}>
                    {familyHistory.name}
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
            isLoading={isSubmitting}
            colorScheme="green"
            onClick={handleSubmit(onSubmit)}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
