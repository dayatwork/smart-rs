import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Input,
  Textarea,
  ModalFooter,
  SimpleGrid,
  Spinner,
  useToast,
  Center,
  InputRightAddon,
  InputGroup,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';

import { createLaboratoryResult } from '../../../../api/laboratory-services/result';
import { getLabCategories } from '../../../../api/institution-services/lab-category';

export const CreateTestResultModal = ({
  isOpen,
  onClose,
  selectedInstitution,
  selectedBloodData,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors } = useForm();
  const queryClient = useQueryClient();

  const { data: dataLabCategories, isLoading: isLoadingLabCategories } =
    useQuery(
      ['insitution-lab-categories', selectedInstitution],
      () => getLabCategories(cookies, selectedInstitution),
      { enabled: Boolean(selectedInstitution) }
    );

  const { mutate } = useMutation(createLaboratoryResult(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'laboratory-result-list',
          selectedInstitution,
        ]);
        await queryClient.invalidateQueries([
          'laboratory-blood-list',
          selectedInstitution,
        ]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Blood test result created`,
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
    const result = dataLabCategories?.data
      ?.filter(
        category => category?.category_id === selectedBloodData?.test_type?.id
      )
      ?.map(item => ({
        subcategory_id: item?.subcategory_id,
        unit: item?.unit,
        result: value?.result[item?.subcategory_id],
        normal_result: item?.range,
      }));
    const data = {
      institution_id: selectedBloodData?.institution_id,
      patient_id: selectedBloodData?.patient?.id,
      employee_id: selectedBloodData?.employee?.id,
      laboratory_id: selectedBloodData?.laboratory_id,
      blood_id: selectedBloodData?.id,
      category_id: selectedBloodData?.test_type?.id,
      method: selectedBloodData?.method,
      // date,
      // time,
      note: value.note,
      result,
    };
    await mutate(data);
  };

  // console.log({ dataLabCategories });
  // console.log({ selectedBloodData });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Blood Test Result</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="patient_id" mb="4">
            <FormLabel>Patient ID</FormLabel>
            <Input
              name="patient_id"
              disabled
              // ref={register}
              defaultValue={selectedBloodData?.patient?.id || ''}
            />
          </FormControl>
          <FormControl id="test_type" mb="4">
            <FormLabel>Type Blood Test</FormLabel>
            <Input
              name="test_type"
              disabled
              // ref={register}
              defaultValue={selectedBloodData?.test_type?.name || ''}
            />
          </FormControl>
          {isLoadingLabCategories && (
            <Center>
              <Spinner />
            </Center>
          )}
          <SimpleGrid columns={2} columnGap="4">
            {dataLabCategories?.data
              ?.filter(
                category =>
                  category?.category_id === selectedBloodData?.test_type?.id
              )
              .map(item => {
                return (
                  <FormControl key={item.id} mb="4">
                    <FormLabel>{item.subcategory_name}</FormLabel>
                    <InputGroup size="sm">
                      <Input {...register(`result[${item.subcategory_id}]`)} />
                      <InputRightAddon children={item.unit} />
                    </InputGroup>
                  </FormControl>
                );
              })}
          </SimpleGrid>
          <FormControl id="note" mb="4">
            <FormLabel>Note</FormLabel>
            <Textarea rows={3} {...register('note')} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Close
          </Button>
          <Button
            isLoading={isLoading}
            colorScheme="purple"
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
