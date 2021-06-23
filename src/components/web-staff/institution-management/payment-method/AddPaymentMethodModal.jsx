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
  Input,
  Box,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import {
  getPaymentMethods,
  createPaymentMethod,
} from '../../../../api/institution-services/payment-method';
import { getPaymentMethods as getPaymentMethodsMaster } from '../../../../api/master-data-services/payment-method';

export const AddPaymentMethodModal = ({
  isOpen,
  onClose,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch } = useForm();
  const paymentMethods = watch('paymentMethods');

  const { data: dataPaymentMethodsMaster } = useQuery(
    'master-payment-methods',
    () => getPaymentMethodsMaster(cookies),
    { staleTime: Infinity }
  );

  const { data: dataPaymentMethods } = useQuery(
    ['insitution-payment-methods', selectedInstitution],
    () => getPaymentMethods(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
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

  const onSubmit = async values => {
    const { paymentMethods, accountNumbers, accountNames } = values;
    const formattedPaymentMethods = paymentMethods
      .map((type, index) => {
        if (type) {
          return {
            ...JSON.parse(type),
            account_number: accountNumbers[index],
            account_name: accountNames[index],
            active: 1,
          };
        }
        return type;
      })
      .filter(payment => payment);
    const data = {
      institution_id: selectedInstitution,
      data: formattedPaymentMethods,
    };
    // console.log({ data });
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
            <SimpleGrid columns={3} gap="4">
              {dataPaymentMethodsMaster?.data
                ?.filter(paymentMethod => {
                  const alreadyPaymentMethods = dataPaymentMethods?.data?.map(
                    paymentMethod => paymentMethod.master_method_id
                  );
                  return !alreadyPaymentMethods?.includes(paymentMethod.id);
                })
                .map((method, index) => (
                  <Box
                    key={method.id}
                    border="1px"
                    borderColor="gray.100"
                    py="2"
                    px="3"
                    bgColor="gray.100"
                  >
                    <Checkbox
                      id={`account-${index}`}
                      value={JSON.stringify({
                        master_method_id: method.id,
                        name: method.name,
                        alias: method.alias,
                        description: method.description,
                      })}
                      colorScheme="purple"
                      {...register(`paymentMethods[${index}]`)}
                    >
                      <Text fontWeight="semibold">{method.name}</Text>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        {method.description}
                      </Text>
                    </Checkbox>
                    <Input
                      id={`account-number-${index}`}
                      mt="2"
                      type="number"
                      placeholder="Account Number"
                      bgColor="white"
                      borderColor="gray.400"
                      size="sm"
                      {...register(`accountNumbers[${index}]`)}
                      disabled={Boolean(
                        paymentMethods && !paymentMethods[index]
                      )}
                    />
                    <Input
                      id={`account-name-${index}`}
                      mt="2"
                      placeholder="Account Name"
                      bgColor="white"
                      borderColor="gray.400"
                      size="sm"
                      {...register(`accountNames[${index}]`)}
                      disabled={Boolean(
                        paymentMethods && !paymentMethods[index]
                      )}
                    />
                  </Box>
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
