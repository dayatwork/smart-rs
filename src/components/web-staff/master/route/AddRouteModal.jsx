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
  Flex,
  VisuallyHidden,
  IconButton,
  Text,
  useToast,
  HStack,
  Textarea,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray } from 'react-hook-form';
import slugify from 'slugify';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

import { getApplications } from '../../../../api/application-services/application';
import { getMenus } from '../../../../api/application-services/menu';
import { createRoute } from '../../../../api/application-services/route';

export const AddRouteModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, control, reset, clearErrors } = useForm({
    defaultValues: {
      routes: [
        { name: 'Index', description: 'First page application' },
        {
          name: 'Read List',
          description: 'Read data from API or access table, list, and grid',
        },
        { name: 'Create', description: 'Create/ write data' },
        { name: 'Read Detail', description: 'Read data only detail' },
        { name: 'Update', description: 'Update/ write data' },
        { name: 'Delete', description: 'Delete/ write data' },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'routes',
  });
  const queryClient = useQueryClient();

  const { data: dataApp } = useQuery('application', () =>
    getApplications(cookies)
  );

  const { data: dataMenu } = useQuery('menu', () => getMenus(cookies));

  const { mutate } = useMutation(createRoute(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-routes');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Applikasi berhasil dibuat`,
          status: 'success',
          duration: 4000,
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
    const { app_id, menu_id, routes } = value;

    const data = routes.map(route => ({
      menu_id,
      name: route.name,
      alias: slugify(route.name, { lower: true }),
      description: route.description,
    }));

    await mutate({
      app_id,
      data,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Route</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box as="form" w="full">
            <FormControl id="application" mb="4">
              <FormLabel>Application</FormLabel>
              <Select
                {...register('app_id', { required: 'Application required' })}
              >
                <option value="">Select Application</option>
                {dataApp?.data?.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="menu" mb="4">
              <FormLabel>Menu</FormLabel>
              <Select {...register('menu_id', { required: 'Menu required' })}>
                <option value="">Select Menu</option>
                {dataMenu?.data?.map(menu => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Box mb="2">
              <Text fontWeight="semibold">Route</Text>
              {fields.map((value, index) => {
                return (
                  <Flex key={value.id}>
                    {/* <FormControl id={`routes-${value.id}`} mb="1"> */}
                    <VisuallyHidden as="label">Routes</VisuallyHidden>
                    <HStack spacing="2" mb="2" w="full" align="stretch">
                      <FormControl id={`routes-name-${value.id}`}>
                        <Input
                          mr="2"
                          defaultValue={value.name}
                          placeholder="Name"
                          {...register(`routes[${index}].name`)}
                        />
                      </FormControl>
                      <FormControl id={`routes-desc-${value.id}`}>
                        <Textarea
                          mr="2"
                          rows="2"
                          defaultValue={value.description}
                          placeholder="Description"
                          {...register(`routes[${index}].description`)}
                        />
                      </FormControl>
                      <IconButton
                        onClick={() => remove(index)}
                        icon={<FaTrashAlt />}
                        p="3"
                        ml="2"
                        colorScheme="red"
                      />
                    </HStack>
                    {/* </FormControl> */}
                  </Flex>
                );
              })}
            </Box>
            <Box textAlign="center">
              <Button
                leftIcon={<FaPlus />}
                type="button"
                onClick={() => append({})}
                // w="full"
              >
                Add Route
              </Button>
            </Box>
          </Box>
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
