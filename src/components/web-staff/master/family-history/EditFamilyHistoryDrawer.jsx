import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Button,
  Box,
  FormControl,
  FormLabel,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useMutation, useQueryClient } from 'react-query';

import { editFamilyHistory } from '../../../../api/master-data-services/family-histories';

export const EditFamilyHistoryDrawer = ({
  isOpen,
  onClose,
  selectedFamilyHistory,
}) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({ name: selectedFamilyHistory?.name });
  }, [selectedFamilyHistory, reset]);

  const { mutate } = useMutation(editFamilyHistory(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-family-histories');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Family history berhasil diedit`,
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

  const onSubmit = async values => {
    const familyHistory = {
      id: selectedFamilyHistory?.id,
      name: values.name,
    };
    await mutate(familyHistory);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm" sele>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Family History</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                id="name"
                mb="8"
                isInvalid={errors?.name ? true : false}
              >
                <FormLabel>Name</FormLabel>
                <Input
                  {...register('name', {
                    required: "Family history's name is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
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
