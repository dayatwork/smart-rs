import React, { useState } from 'react';
import {
  Button,
  FormControl,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VisuallyHidden,
  ModalFooter,
  SimpleGrid,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import {
  createServiceType,
  getServiceTypes,
} from '../../../../api/institution-services/service';
import { getServiceTypes as getServiceTypesMaster } from '../../../../api/master-data-services/service';

export const AddServiceTypeModal = ({
  isOpen,
  onClose,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors } = useForm();
  const queryClient = useQueryClient();

  const { data: dataServiceTypesMaster } = useQuery(
    'master-service-types',
    () => getServiceTypesMaster(cookies),
    { staleTime: Infinity }
  );

  const { data: dataServiceTypes } = useQuery(
    ['service-types', selectedInstitution],
    () => getServiceTypes(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const { mutate } = useMutation(createServiceType(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'service-types',
          selectedInstitution,
        ]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Service type created`,
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
    const { types } = values;
    const formattedTypes = types.map(type => JSON.parse(type));
    const data = {
      institution_id: selectedInstitution,
      data: formattedTypes,
    };
    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Service Type</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="types">
            <VisuallyHidden as="label">Service Types</VisuallyHidden>
            <SimpleGrid columns={3} gap="2">
              {dataServiceTypesMaster?.data
                ?.filter(type => {
                  const alreadyTypes = dataServiceTypes?.data?.map(
                    type => type.master_type_id
                  );
                  return !alreadyTypes?.includes(type.id);
                })
                .map((type, index) => (
                  <Checkbox
                    key={type.id}
                    value={JSON.stringify({
                      master_type_id: type.id,
                      name: type.name,
                      description: type.description,
                    })}
                    {...register(`types[${index}]`)}
                  >
                    <Text fontWeight="semibold">{type.name}</Text>
                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                      {type.description}
                    </Text>
                  </Checkbox>
                ))}
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
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
