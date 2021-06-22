import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useToast,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';

import { editLaboratoryBlood } from '../../../../api/laboratory-services/blood';

export const EditBloodDataDrawer = ({
  isOpen,
  onClose,
  selectedBloodData,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { handleSubmit, register, reset, clearErrors } = useForm();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(editLaboratoryBlood(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'laboratory-blood-list',
          selectedInstitution,
        ]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Blood data edited`,
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
    const data = {
      id: selectedBloodData?.id,
      method: value.method,
      amount: value.amount,
      not: value.note,
    };
    await mutate(data);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm" sele>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Update Blood Data</DrawerHeader>

          <DrawerBody>
            <Box as="form">
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
              <FormControl id="method" mb="4">
                <FormLabel>Method of Blood Draw</FormLabel>
                <Select {...register('method')}>
                  <option value="">Select Method</option>
                  <option value="default">Default</option>
                </Select>
              </FormControl>
              <FormControl id="method" mb="4">
                <FormLabel>Amount of Blood</FormLabel>
                <Input
                  defaultValue={selectedBloodData?.amount || ''}
                  {...register('amount')}
                />
              </FormControl>
              <FormControl id="note" mb="4">
                <FormLabel>Note</FormLabel>
                <Textarea
                  defaultValue={selectedBloodData?.note || ''}
                  rows={3}
                  {...register('note')}
                />
              </FormControl>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              colorScheme="purple"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
