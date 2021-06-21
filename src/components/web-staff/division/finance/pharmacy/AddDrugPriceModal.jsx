import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useToast,
  FormLabel,
  Select,
  Center,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';

import { getDrugs } from '../../../../../api/pharmacy-services/drug';
import { createDrugPrice } from '../../../../../api/finance-services/drug-price';

export const AddDrugPriceModal = ({
  isOpen,
  onClose,
  selectedInstitution,
  alreadyDrugPrices,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors } = useForm();

  const queryClient = useQueryClient();

  const {
    data: dataDrugs,

    isLoading: isLoadingDrugs,
  } = useQuery(
    ['drugs', selectedInstitution],
    () => getDrugs(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const { mutate } = useMutation(createDrugPrice(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'drug-prices',
          selectedInstitution,
        ]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          title: 'Success',
          description: `Drug price added successfully`,
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
    const drugs = values.drugs.map(drug => ({
      ...drug,
      price: drug.price ? Number(drug.price) : 0,
      tax: drug.tax ? Number(drug.tax) : null,
    }));
    const payload = {
      institution_id: selectedInstitution,
      data: drugs,
    };
    await mutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Drug</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoadingDrugs && (
            <Center>
              <Spinner />
            </Center>
          )}
          <Box mb="2">
            {dataDrugs?.data
              ?.filter(drug => !alreadyDrugPrices?.includes(drug.id))
              .map((drug, index) => {
                return (
                  <HStack spacing="4" key={drug.id}>
                    <FormControl id={`drug_id-${index}`} mb="4" display="none">
                      <FormLabel>Drug ID</FormLabel>
                      <Input
                        defaultValue={drug?.id}
                        {...register(`drugs[${index}].drug_id`)}
                      />
                    </FormControl>
                    <FormControl id={`drug_name-${index}`} mb="4">
                      <FormLabel>Drug Name</FormLabel>
                      <Input
                        // name={`drugs[${index}].drug_name`}
                        // ref={register}
                        defaultValue={drug?.name}
                        readOnly
                      />
                    </FormControl>
                    <FormControl id={`price-${index}`} mb="4">
                      <FormLabel>Price</FormLabel>
                      <Input
                        type="number"
                        {...register(`drugs[${index}].price`)}
                      />
                    </FormControl>
                    <FormControl id={`tax-${index}`} mb="4">
                      <FormLabel>Tax</FormLabel>
                      <Input
                        type="number"
                        {...register(`drugs[${index}].tax`)}
                      />
                    </FormControl>
                    <FormControl id={`currency-${index}`} mb="4">
                      <FormLabel>Tax</FormLabel>
                      <Select {...register(`drugs[${index}].currency`)}>
                        <option value="">Select Currency</option>
                        <option value="Rp">Rp</option>
                      </Select>
                    </FormControl>
                  </HStack>
                );
              })}
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
