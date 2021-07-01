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
  HStack,
} from '@chakra-ui/react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ReactSelect from 'react-select';

import {
  getDepartmentTypes,
  createDepartment,
} from '../../../../api/institution-services/department';
import { getEventNodes } from '../../../../api/application-services/event-node';

export const AddDepartmentModal = ({
  isOpen,
  onClose,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'departments',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

  const { data: dataDepartmentTypes, isSuccess: isSuccessDepartmentTypes } =
    useQuery(
      ['department-types', selectedInstitution],
      () => getDepartmentTypes(cookies, selectedInstitution),
      { enabled: Boolean(selectedInstitution), staleTime: Infinity }
    );

  const { data: resEventNode } = useQuery(
    'master-event-nodes',
    () => getEventNodes(cookies),
    { staleTime: Infinity }
  );

  const { mutate } = useMutation(createDepartment(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'departments',
          selectedInstitution,
        ]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Department created`,
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
    const departments = values.departments.map(department => ({
      ...department,
      event_node: department.event_node.map(event => event.value),
    }));
    const data = {
      institution_id: selectedInstitution,
      data: departments,
    };

    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Department</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb="2">
            {fields.map(({ id }, index) => {
              return (
                <HStack key={id} mb="2">
                  <FormControl id="type">
                    <VisuallyHidden as="label">Type</VisuallyHidden>
                    <Select
                      {...register(`departments[${index}].department_type_id`)}
                    >
                      <option value="">Select Department Type</option>
                      {isSuccessDepartmentTypes &&
                        dataDepartmentTypes?.data?.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl id="name">
                    <VisuallyHidden as="label">Name</VisuallyHidden>
                    <Input
                      placeholder="Name"
                      {...register(`departments[${index}].name`)}
                    />
                  </FormControl>
                  <FormControl id="description">
                    <VisuallyHidden as="label">Description</VisuallyHidden>
                    <Input
                      placeholder="Description"
                      {...register(`departments[${index}].description`)}
                    />
                  </FormControl>
                  <FormControl id="events">
                    <VisuallyHidden as="label">Event Node</VisuallyHidden>
                    <Controller
                      as={ReactSelect}
                      name={`departments[${index}].event_node`}
                      isMulti
                      control={control}
                      options={resEventNode?.data.map(event => ({
                        value: event.id,
                        label: event.name,
                      }))}
                      defaultValue={[]}
                    />
                  </FormControl>
                  <IconButton
                    onClick={() => remove(index)}
                    icon={<FaTrashAlt />}
                    p="3"
                    colorScheme="red"
                  />
                </HStack>
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
