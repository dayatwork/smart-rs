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
  Text,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';

import {
  createEventNode,
  getEventNodes,
} from '../../../../api/institution-services/event-node';
import { getEventNodes as getEventNodesMaster } from '../../../../api/application-services/event-node';

export const AddEventNodeModal = ({ isOpen, onClose, selectedInstitution }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors } = useForm();
  const queryClient = useQueryClient();

  const { data: dataEventNodeMaster } = useQuery(
    'master-event-nodes',
    () => getEventNodesMaster(cookies),
    { staleTime: Infinity },
  );

  const { data: dataEventNode } = useQuery(
    ['event-nodes', selectedInstitution],
    () => getEventNodes(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
    },
  );

  const { mutate } = useMutation(createEventNode(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries(['event-nodes', selectedInstitution]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Event node berhasil ditambah`,
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
    const events = values.events
      .filter((event) => !!event)
      .map((event) => JSON.parse(event));

    const data = events.map((event) => ({
      master_event_node_id: event.master_event_node_id,
      name: event.name,
      description: event.description,
      path: event.path,
    }));

    const payload = {
      institution_id: selectedInstitution,
      data,
    };

    await mutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Event Node</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="types">
            <FormLabel>Event Nodes</FormLabel>
            <SimpleGrid columns={3} gap="4">
              {dataEventNodeMaster?.data
                ?.filter((event) => {
                  const alreadyEvent = dataEventNode?.data?.map(
                    (event) => event.master_event_node_id,
                  );
                  return !alreadyEvent?.includes(event.id);
                })
                .map((event, index) => {
                  return (
                    <Checkbox
                      colorScheme="purple"
                      key={event.id}
                      value={JSON.stringify({
                        master_event_node_id: event.id,
                        name: event.name,
                        description: event.description,
                        path: event.path,
                      })}
                      {...register(`events[${index}]`)}>
                      <Text fontWeight="semibold">
                        {event.name} ({event.path})
                      </Text>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        {event.description}
                      </Text>
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
            onClick={handleSubmit(onSubmit)}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
