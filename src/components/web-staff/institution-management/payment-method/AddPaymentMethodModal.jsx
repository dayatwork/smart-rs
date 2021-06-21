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
  getPaymentMethods,
  createPaymentMethod,
} from '../../../../api/institution-services/payment-method';
import { getPaymentMethods as getPaymentMethodsMaster } from '../../../../api/master-data-services/payment-method';

export const AddPaymentMethodModal = ({ isOpen, onClose, selectedInstitution }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: dataPaymentMethodsMaster } = useQuery(
    'master-payment-methods',
    () => getPaymentMethodsMaster(cookies),
    { staleTime: Infinity },
  );

  const { data: dataPaymentMethods } = useQuery(
    ['insitution-payment-methods', selectedInstitution],
    () => getPaymentMethods(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity },
  );

  const { mutate } = useMutation(createPaymentMethod(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'insitution-payment-methods',
          selectedInstitution,
        ]);
        setErrMessage('');
        reset();
        toast({
          title: 'Success',
          description: `Payment method added successfully`,
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
    const { paymentMethods } = values;
    const formattedPaymentMethods = paymentMethods
      .filter((payment) => !!payment)
      .map((type) => JSON.parse(type));
    const data = {
      institution_id: selectedInstitution,
      data: formattedPaymentMethods,
    };
    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Payment Method</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="types">
            <VisuallyHidden as="label">Payment Method</VisuallyHidden>
            <SimpleGrid columns={3} gap="2">
              {dataPaymentMethodsMaster?.data
                ?.filter((paymentMethod) => {
                  const alreadyPaymentMethods = dataPaymentMethods?.data?.map(
                    (paymentMethod) => paymentMethod.master_method_id,
                  );
                  return !alreadyPaymentMethods?.includes(paymentMethod.id);
                })
                .map((method, index) => (
                  <Checkbox
                    key={method.id}
                    value={JSON.stringify({
                      master_method_id: method.id,
                      name: method.name,
                      alias: method.alias,
                      description: method.description,
                    })}
                    colorScheme="purple"
                    {...register(`paymentMethods[${index}]`)}>
                    <Text fontWeight="semibold">{method.name}</Text>
                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                      {method.description}
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
            onClick={handleSubmit(onSubmit)}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
