import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import {
  getServiceTypes,
  getServices,
  createService,
} from '../../../../api/institution-services/service';
import { getServices as getServicesMaster } from '../../../../api/master-data-services/service';

export const AddServiceModal = ({ isOpen, onClose, selectedInstitution }) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [serviceType, setServiceType] = useState('');
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

  const { data: dataServicesMaster } = useQuery(
    'master-services',
    () => getServicesMaster(cookies),
    // { staleTime: Infinity },
  );

  const { data: dataServices } = useQuery(
    ['services', selectedInstitution],
    () => getServices(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
      // staleTime: Infinity,
    },
  );

  const { data: dataServiceTypes, isSuccess: isSuccessServiceTypes } = useQuery(
    ['service-types', selectedInstitution],
    () => getServiceTypes(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
      // staleTime: Infinity
    },
  );

  const { mutate } = useMutation(createService(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries(['services', selectedInstitution]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Service created`,
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
    const services = values.services
      .filter((service) => !!service)
      .map((service) => JSON.parse(service));
    const service_type_id = JSON.parse(serviceType).id;

    const data = services.map((service) => ({
      service_type_id,
      master_service_id: service.master_service_id,
      name: service.name,
      description: service.description,
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
        <ModalHeader>Add New Service</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb="4" maxW="md">
            <FormLabel>Service Type</FormLabel>
            <Select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
              <option value="">Select Service Type</option>
              {isSuccessServiceTypes &&
                dataServiceTypes?.data?.map((type) => {
                  return (
                    <option
                      key={type.id}
                      value={JSON.stringify({
                        id: type.id,
                        master: type.master_type_id,
                      })}>
                      {type.name}
                    </option>
                  );
                })}
            </Select>
          </FormControl>
          {serviceType && (
            <FormControl id="types">
              <FormLabel>Services</FormLabel>
              <SimpleGrid columns={3} gap="2">
                {dataServicesMaster?.data
                  ?.filter((service) => {
                    const alreadyService = dataServices?.data?.map(
                      (service) => service.master_service_id,
                    );
                    return !alreadyService?.includes(service.id);
                  })
                  .filter(
                    (service) =>
                      service.service_type_id === JSON.parse(serviceType || {}).master,
                  )
                  .map((service, index) => {
                    return (
                      <Checkbox
                        key={service.id}
                        value={JSON.stringify({
                          master_service_id: service.id,
                          name: service.name,
                          description: service.description,
                        })}
                        {...register(`services[${index}]`)}>
                        <Text fontWeight="semibold">{service.name}</Text>
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">
                          {service.description}
                        </Text>
                      </Checkbox>
                    );
                  })}
              </SimpleGrid>
            </FormControl>
          )}
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
