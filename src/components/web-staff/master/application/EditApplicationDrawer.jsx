import React, { useState } from 'react';
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
  HStack,
  Checkbox,
  Textarea,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useMutation, useQueryClient } from 'react-query';

import { EditApplication } from '../../../../api/application-services/application';

export const EditApplicationDrawer = ({ isOpen, onClose, selectedApp }) => {
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

  const { mutate } = useMutation(EditApplication(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-application');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Applikasi berhasil diedit`,
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

  const onSubmit = async (values) => {
    const platform = values.platform.filter((plat) => plat !== false);
    const application = {
      id: selectedApp?.id,
      name: values.name,
      platform,
      description: values.description,
    };

    await mutate(application);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm" sele>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Role</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl id="name" mb="8" isInvalid={errors?.name ? true : false}>
                <FormLabel>Application Name</FormLabel>
                <Input
                  defaultValue={selectedApp?.name || ''}
                  {...register('name', { required: 'Application name required' })}
                />
                <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
              </FormControl>
              <FormControl id="platform" mb="8">
                <FormLabel>Platform</FormLabel>

                <HStack spacing="10">
                  <Checkbox
                    colorScheme="purple"
                    value="website"
                    defaultIsChecked={selectedApp?.platform.includes('website')}
                    {...register('platform[0]')}>
                    Website
                  </Checkbox>
                  <Checkbox
                    colorScheme="purple"
                    value="mobile"
                    defaultIsChecked={selectedApp?.platform.includes('mobile')}
                    {...register('platform[1]')}>
                    Mobile
                  </Checkbox>
                  <Checkbox
                    colorScheme="purple"
                    value="desktop"
                    defaultIsChecked={selectedApp?.platform.includes('desktop')}
                    {...register('platform[2]')}>
                    Desktop
                  </Checkbox>
                  <FormErrorMessage>
                    {errors.platform && errors.platform.message}
                  </FormErrorMessage>
                </HStack>
              </FormControl>
              <FormControl id="description" mb="8">
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Description"
                  defaultValue={selectedApp?.description}
                  {...register('description')}
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
              onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
