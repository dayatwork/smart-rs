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
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

import { getApplications } from '../../../../api/application-services/application';
import { createEventNode } from '../../../../api/application-services/event-node';

export const AddEventNodeModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, control, reset, clearErrors } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'event_nodes',
  });
  const queryClient = useQueryClient();

  const { data: dataApp } = useQuery('master-application', () =>
    getApplications(cookies)
  );

  const { mutate } = useMutation(createEventNode(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries('master-event-nodes');
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Event node berhasil dibuat`,
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
    const { app_id, event_nodes } = value;

    await mutate({
      app_id,
      data: event_nodes,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Event Node</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box as="form">
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
            <Box mb="2">
              <Text fontWeight="semibold">Event Node</Text>
              {fields.map((value, index) => {
                return (
                  <Flex key={value.id}>
                    {/* <FormControl id={`event_nodes-${value.id}`} mb="1"> */}
                    <VisuallyHidden as="label">Event Node</VisuallyHidden>
                    <HStack spacing="2" mb="2">
                      <FormControl id={`event_nodes-name-${value.id}`}>
                        <Input
                          placeholder="Name"
                          mr="2"
                          {...register(`event_nodes[${index}].name`)}
                        />
                      </FormControl>
                      <FormControl id={`event_nodes-desc-${value.id}`}>
                        <Input
                          placeholder="Description"
                          mr="2"
                          defaultValue={value.description}
                          {...register(`event_nodes[${index}].description`)}
                        />
                      </FormControl>
                    </HStack>
                    {/* </FormControl> */}
                    <IconButton
                      onClick={() => remove(index)}
                      icon={<FaTrashAlt />}
                      p="3"
                      ml="2"
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
