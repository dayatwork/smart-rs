import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import slugify from 'slugify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';

import { getApplications } from '../../../../api/application-services/application';
import { createMenu, getMenus } from '../../../../api/application-services/menu';

export const AddMenuModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');

  // ========== Query ========== //
  const { data: resMenu, isSuccess: isSuccessMenu } = useQuery('menu', () =>
    getMenus(cookies),
  );
  const { data: resApp, isSuccess: isSuccessApp } = useQuery('application', () =>
    getApplications(cookies),
  );

  // ========== Mutation ========== //
  const { mutate } = useMutation(createMenu(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-menu');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Menu berhasil dibuat`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }

      if (error) {
        setErrMessage(error.message || 'Error');
      }
    },
  });

  const onSubmit = async (value) => {
    const { application, name, description, parent } = value;
    const menu = {
      app_id: application,
      data: [
        {
          name,
          alias: slugify(name, { lower: true }),
          description,
          parent_id: parent === '' ? null : parent,
          status: 1,
        },
      ],
    };

    await mutate(menu);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Menu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <FormControl
              id="application"
              mb="4"
              isInvalid={errors?.application ? true : false}>
              <FormLabel>Application</FormLabel>
              <Select {...register('application', { required: 'Application Required' })}>
                <option value="">Select App</option>
                {isSuccessApp &&
                  resApp?.data?.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
              </Select>
              <FormErrorMessage>
                {errors.application && errors.application.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="name" mb="4" isInvalid={errors?.name ? true : false}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                {...register('name', { required: 'Menu Name Required' })}
              />
              <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
            </FormControl>
            <FormControl id="description" mb="4">
              <FormLabel>Description</FormLabel>
              <Input type="text" {...register('description')} />
            </FormControl>
            <FormControl id="parent" mb="4">
              <FormLabel>Parent</FormLabel>
              <Select {...register('parent')}>
                <option value="">Select Parent</option>
                {isSuccessMenu &&
                  resMenu?.data?.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button type="button" mr={3} onClick={onClose} variant="ghost">
            Close
          </Button>
          <Button
            colorScheme="purple"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
