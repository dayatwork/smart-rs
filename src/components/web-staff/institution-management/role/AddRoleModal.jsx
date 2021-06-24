import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  SimpleGrid,
  Checkbox,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';

import { useForm } from 'react-hook-form';

import {
  getInstitutionRoles,
  createInstitutionRole,
} from '../../../../api/human-capital-services/role';
import { getRoles } from '../../../../api/user-services/role-management';

export const AddRoleModal = ({ isOpen, onClose, selectedInstitution }) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

  const { data: dataRoles } = useQuery('user-roles', () => getRoles(cookies), {
    staleTime: Infinity,
  });

  const { data: dataRolesInst } = useQuery(
    ['institution-roles', selectedInstitution],
    () => getInstitutionRoles(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const { mutate } = useMutation(createInstitutionRole(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('institution-roles');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Role berhasil dibuat`,
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

  const onSubmit = async values => {
    const { roles } = values;
    const formattedRoles = roles
      .filter(role => !!role)
      .map(role => JSON.parse(role));

    const data = {
      institution_id: selectedInstitution,
      data: formattedRoles,
    };

    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Role</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="roles">
            <FormLabel>Roles</FormLabel>
            <SimpleGrid columns={4} gap="2">
              {dataRoles?.data
                ?.filter(
                  role =>
                    role.name !== 'Super Admin' &&
                    role.name !== 'Hospital Admin' &&
                    role.name !== 'Basic User'
                )
                .map((role, index) => {
                  return (
                    <Checkbox
                      colorScheme="purple"
                      key={role.id}
                      value={JSON.stringify({
                        master_role_id: role.id,
                        name: role.name,
                        alias: role.alias,
                      })}
                      defaultChecked={dataRolesInst?.data
                        ?.map(role => role.master_role_id)
                        .includes(role.id)}
                      {...register(`roles[${index}]`)}
                    >
                      {role.name}
                    </Checkbox>
                  );
                })}
            </SimpleGrid>
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
