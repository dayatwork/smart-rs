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
  Select,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import slugify from 'slugify';

import { getApplications } from '../../../../api/application-services/application';
import {
  getMenus,
  updateMenu,
} from '../../../../api/application-services/menu';

export const EditMenuDrawer = ({ isOpen, onClose, selectedMenu }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({
      app_id: selectedMenu?.app_id,
      name: selectedMenu?.name,
      description: selectedMenu?.description,
      parent_id: selectedMenu?.parent_id,
    });
  }, [selectedMenu, reset]);

  const { data: resApp, isSuccess: isSuccessApp } = useQuery(
    'application',
    () => getApplications(cookies)
  );
  const { data: resMenu, isSuccess: isSuccessMenu } = useQuery('menu', () =>
    getMenus(cookies)
  );

  const { mutate } = useMutation(updateMenu(cookies), {
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
          description: `Menu berhasil diedit`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }

      if (error) {
        setErrMessage(error.message || 'Error');
      }
    },
  });

  const onSubmit = async value => {
    const { app_id, name, description, parent_id } = value;
    const menu = {
      id: selectedMenu.id,
      app_id,
      name,
      alias: slugify(name, { lower: true }),
      description,
      parent_id,
    };

    await mutate(menu);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Menu</DrawerHeader>

          <DrawerBody>
            <Box as="form">
              <FormControl
                id="application"
                mb="4"
                isInvalid={errors?.application ? true : false}
              >
                <FormLabel>Application</FormLabel>
                <Select
                  {...register('app_id', {
                    required: 'Application Required',
                  })}
                >
                  <option value="">Select App</option>
                  {isSuccessApp &&
                    resApp?.data?.map(app => (
                      <option key={app.id} value={app.id}>
                        {app.name}
                      </option>
                    ))}
                </Select>
                <FormErrorMessage>
                  {errors.application && errors.application.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="name"
                mb="4"
                isInvalid={errors?.name ? true : false}
              >
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  {...register('name', { required: 'Menu Name Required' })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="description" mb="4">
                <FormLabel>Description</FormLabel>
                <Input type="text" {...register('description')} />
              </FormControl>
              <FormControl id="parent" mb="4">
                <FormLabel>Parent</FormLabel>
                <Select {...register('parent_id')}>
                  <option value="">Select Parent</option>
                  {isSuccessMenu &&
                    resMenu?.data?.map(menu => (
                      <option key={menu.id} value={menu.id}>
                        {menu.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              isLoading={isLoading}
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
