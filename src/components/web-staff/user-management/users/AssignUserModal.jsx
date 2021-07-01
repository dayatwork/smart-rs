import React, { useState, useEffect } from 'react';
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
  FormLabel,
  VStack,
  Select,
  Heading,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';

import { getInstitutions } from '../../../../api/institution-services/institution';
import { getRoles } from '../../../../api/user-services/role-management';
import { assignRole } from '../../../../api/user-services/user-management';

export const AssignUserModal = ({
  isOpen,
  onClose,
  selectedUser,
  setSelectedUser,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({
      institution: selectedUser?.institution_id,
      role: selectedUser?.role_id,
    });
  }, [selectedUser, reset]);

  const { data: dataInstitutions } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const { data: dataRoles } = useQuery('user-roles', () => getRoles(cookies), {
    staleTime: Infinity,
  });

  const onSubmit = async value => {
    const { institution, role } = value;

    const data = {
      user_id: selectedUser.id,
      institution_id: institution,
      role_id: role,
    };

    try {
      setIsLoading(true);
      await assignRole(cookies, data);
      await queryClient.invalidateQueries('users');
      setIsLoading(false);

      setSelectedUser(null);
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Assign role berhasil`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Assign role gagal`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="2">
            <Heading fontSize="lg">User Name: {selectedUser?.name}</Heading>
            <FormControl id="institution">
              <FormLabel>Institution</FormLabel>
              <Select {...register('institution')}>
                <option value="">Select Institution</option>
                {dataInstitutions?.data?.map(institution => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
              </Select>
            </FormControl>
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
            Assign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
