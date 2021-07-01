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
  FormControl,
  useToast,
  FormLabel,
  Select,
  FormErrorMessage,
  VStack,
  Checkbox,
  Spinner,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import {
  getRoles,
  assignAccessControl,
} from '../../../../api/user-services/role-management';
import { getMenus } from '../../../../api/application-services/menu';
import { getRoutesByMenu } from '../../../../api/application-services/route';

export const AssignAccessModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

  const menuWatch = watch('menu');

  const { data: dataRoles } = useQuery('user-roles', () => getRoles(cookies));

  const { data: dataMenu } = useQuery('master-menus', () => getMenus(cookies), {
    staleTime: Infinity,
  });

  const {
    data: dataRoutes,
    isLoading: isLoadingRoute,
    isSuccess: isSuccessRoute,
  } = useQuery(
    ['master-routes', menuWatch],
    () => getRoutesByMenu(cookies, menuWatch),
    {
      enabled: Boolean(menuWatch),
      staleTime: Infinity,
    }
  );

  const { mutate } = useMutation(assignAccessControl(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('default-access-control');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Role berhasil di assign`,
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
    const { role, menu, routes } = value;
    const menuParse = JSON.parse(menu);
    const resource_id = menuParse.id;
    const resource = menuParse.alias;

    const filteredRoutes = routes
      .filter(route => !!route)
      .map(route => JSON.parse(route));

    const data = filteredRoutes.map(route => ({
      resource_id,
      resource,
      route_id: route.id,
      attribute: route.alias,
    }));

    await mutate({ role_id: role, data });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Access Control</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <FormControl id="role" isInvalid={errors?.role ? true : false}>
              <FormLabel>Role</FormLabel>
              <Select {...register('role', { required: 'Role is required' })}>
                <option value="">Select Role</option>
                {dataRoles?.data?.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.role && errors.role.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="menu" isInvalid={errors?.menu ? true : false}>
              <FormLabel>Menu</FormLabel>
              <Select {...register('menu', { required: 'Menu is required' })}>
                <option value="">Select menu</option>
                {dataMenu?.data?.map(menu => (
                  <option
                    key={menu.id}
                    value={JSON.stringify({ id: menu.id, alias: menu.alias })}
                  >
                    {menu.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.menu && errors.menu.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="routes">
              <FormLabel>Routes</FormLabel>
              <SimpleGrid columns={4}>
                {isLoadingRoute && <Spinner />}
                {dataRoutes?.data?.map((route, index) => (
                  <Checkbox
                    colorScheme="purple"
                    key={route.id}
                    value={JSON.stringify({ id: route.id, alias: route.alias })}
                    {...register(`routes[${index}]`)}
                  >
                    {route.name}
                  </Checkbox>
                ))}
              </SimpleGrid>
              {isSuccessRoute && !dataRoutes.data.length && (
                <Text>Belum ada route</Text>
              )}
            </FormControl>
          </VStack>
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
