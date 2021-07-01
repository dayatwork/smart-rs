import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  Input,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  FormLabel,
  DrawerFooter,
  Select,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';

import { editDrugPrice } from '../../../../../api/finance-services/drug-price';

export const EditDrugPriceDrawer = ({
  isOpen,
  onClose,
  selectedDrug,
  selectedInstitution,
}) => {
  const toast = useToast();
  const [, setErrMessage] = useState('');
  const { register, handleSubmit, reset, clearErrors } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({
      drug_id: selectedDrug?.drug_id,
      price: selectedDrug?.price,
      tax: selectedDrug?.tax,
      currency: selectedDrug?.currency,
    });
  }, [selectedDrug, reset]);

  const { mutate } = useMutation(editDrugPrice(cookies), {
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
          position: 'top-right',
          title: 'Success',
          description: `Drug price edited successfully`,
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
    const drug = {
      id: selectedDrug?.id,
      drug_id: selectedDrug?.drug_id,
      price: values.price ? Number(values.price) : 0,
      tax: values.tax ? Number(values.tax) : null,
      currency: values.currency,
    };

    await mutate(drug);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm" sele>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Drug Price</DrawerHeader>

          <DrawerBody>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              {/* <FormControl
                id="name"
                mb="4"
                isInvalid={errors?.name ? true : false}
              >
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  ref={register({ required: "Name is required" })}
                  defaultValue={selectedDrug?.name || ""}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl> */}
              <FormControl id="drug_id" mb="4">
                <FormLabel>Drug ID</FormLabel>
                <Input readOnly {...register('drug_id')} />
              </FormControl>
              <FormControl id="price" mb="4">
                <FormLabel>Price</FormLabel>
                <Input {...register('price')} />
              </FormControl>
              <FormControl id="tax" mb="4">
                <FormLabel>Tax</FormLabel>
                <Input {...register('tax')} />
              </FormControl>

              <FormControl id="currency" mb="4">
                <FormLabel>Currency</FormLabel>
                <Select {...register('currency')}>
                  <option value="">Select Currency</option>
                  <option value="Rp">Rp</option>
                </Select>
              </FormControl>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              colorScheme="purple"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
