import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VisuallyHidden,
  Input,
  IconButton,
  ModalFooter,
  Flex,
} from '@chakra-ui/react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useForm, useFieldArray } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import {
  getInfrastructureTypes,
  createInfrastructure,
} from '../../../../../api/institution-services/infrastructure';
import { getDepartments } from '../../../../../api/institution-services/department';

export const AddInfrastructureModal = ({
  isOpen,
  onClose,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'infrastructures',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

  const {
    data: dataInfrastructureTypes,
    isSuccess: isSuccessInfrastructureTypes,
  } = useQuery(
    'infrastructure-types',
    () => getInfrastructureTypes(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const { data: dataDepartments, isSuccess: isSuccessDepartments } = useQuery(
    'departments',
    () => getDepartments(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const { mutate } = useMutation(createInfrastructure(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('infrastructures');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Infrastructure created`,
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
    const { infrastructures } = values;

    const data = {
      institution_id: selectedInstitution,
      data: infrastructures,
    };

    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="7xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Infrastructure</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="2">
            {fields.map(({ id }, index) => {
              return (
                <Flex key={id} mb="2">
                  <FormControl id="type" mr="2">
                    <VisuallyHidden as="label">Type</VisuallyHidden>
                    <Select
                      {...register(
                        `infrastructures[${index}].infrastructure_type_id`
                      )}
                    >
                      <option value="">Select Infrastructure Type</option>
                      {isSuccessInfrastructureTypes &&
                        dataInfrastructureTypes?.data?.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl id="department" mr="2">
                    <VisuallyHidden as="label">Department</VisuallyHidden>
                    <Select
                      {...register(`infrastructures[${index}].department_id`)}
                    >
                      <option value="">Select Department</option>
                      {isSuccessDepartments &&
                        dataDepartments?.data?.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl id="name" mr="2">
                    <VisuallyHidden as="label">Name</VisuallyHidden>
                    <Input
                      placeholder="Name"
                      {...register(`infrastructures[${index}].name`)}
                    />
                  </FormControl>
                  <FormControl id="description" mr="2">
                    <VisuallyHidden as="label">Description</VisuallyHidden>
                    <Input
                      placeholder="Description"
                      {...register(`infrastructures[${index}].description`)}
                    />
                  </FormControl>
                  <FormControl id="status" mr="2">
                    <VisuallyHidden as="label">Status</VisuallyHidden>
                    <Select
                      defaultValue="active"
                      {...register(`infrastructures[${index}].status`)}
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="deactivated">Not Active</option>
                    </Select>
                  </FormControl>
                  {/* <FormControl id="status-reason" mr="2">
                    <VisuallyHidden as="label">Status Reason</VisuallyHidden>
                    <Textarea
                      placeholder="Status Reason"
                      ref={register()}
                      name={`infrastructures[${index}].status_reason`}
                      rows={1}
                    />
                  </FormControl> */}
                  <IconButton
                    onClick={() => remove(index)}
                    icon={<FaTrashAlt />}
                    p="3"
                    colorScheme="red"
                  />
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
              Add Type
            </Button>
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
