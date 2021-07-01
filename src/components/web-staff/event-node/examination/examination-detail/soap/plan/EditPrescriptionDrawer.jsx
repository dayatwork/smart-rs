import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Switch,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Select,
  Input,
} from '@chakra-ui/react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useCookies } from 'react-cookie';

import { editPatientPrescription } from '../../../../../../../api/medical-record-services/soap';
import { getDrugs } from '../../../../../../../api/pharmacy-services/drug';

export const EditPrescriptionDrawer = ({
  isOpen,
  onClose,
  selectedPrescription,
  dataSoap,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const [from, setFrom] = useState(
    selectedPrescription?.start_at && new Date(selectedPrescription?.start_at)
  );
  const [to, setTo] = useState(
    selectedPrescription?.end_at && new Date(selectedPrescription?.end_at)
  );
  const { register, handleSubmit, reset, clearErrors, control } = useForm();

  // useEffect(() => {
  //   reset({
  //     start_at: selectedPrescription?.start_at,
  //     end_at: selectedPrescription?.end_at,
  //   });
  // }, [selectedPrescription]);

  const {
    data: dataDrugs,
    // isSuccess: isSuccessDrugs,
    // isLoading: isLoadingDrugs,
    // isFetching: isFetchingDrugs,
  } = useQuery(
    ['drugs', dataSoap?.institution_id],
    () => getDrugs(cookies, dataSoap?.institution_id),
    { enabled: Boolean(dataSoap?.institution_id) }
  );

  const queryClient = useQueryClient();

  const { mutate } = useMutation(editPatientPrescription(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      onClose();
      if (data) {
        await queryClient.invalidateQueries([
          'prescription',
          dataSoap?.institution_id,
          dataSoap?.soap_plans[0]?.id,
        ]);
        setErrMessage('');
        reset();
        clearErrors();
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Prescription edited successfully`,
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
    const {
      drug,
      quantity,
      frequency,
      description,
      eat,
      routine,
      start_at,
      end_at,
    } = values;
    const data = {
      id: selectedPrescription?.id,
      drug_id: JSON.parse(drug).id,
      drug_name: JSON.parse(drug).name,
      quantity,
      frequency,
      description,
      eat,
      routine,
      start_at: new Date(start_at).toISOString().split('T')[0],
      end_at: new Date(end_at).toISOString().split('T')[0],
    };

    await mutate(data);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Prescription</DrawerHeader>

          <DrawerBody>
            <Box as="form">
              <FormControl id="name" mb="4">
                <FormLabel>Drug</FormLabel>
                <Select
                  defaultValue={JSON.stringify({
                    id: selectedPrescription?.drug_id,
                    name: selectedPrescription?.drug_name,
                  })}
                  {...register('drug')}
                >
                  <option value="">Select Medicine</option>
                  {dataDrugs?.data?.map(drug => (
                    <option
                      key={drug.id}
                      value={JSON.stringify({
                        id: drug.id,
                        name: drug.name,
                      })}
                    >
                      {drug.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="quantity" mb="4">
                <FormLabel>Quantity</FormLabel>
                <Input
                  defaultValue={selectedPrescription?.quantity}
                  type="number"
                  {...register('quantity')}
                />
              </FormControl>
              <FormControl id="frequency" mb="4">
                <FormLabel>Frequency</FormLabel>
                <Input
                  defaultValue={selectedPrescription?.frequency}
                  type="number"
                  {...register('frequency')}
                />
              </FormControl>
              <FormControl id="description" mb="4">
                <FormLabel>Description</FormLabel>
                <Textarea
                  defaultValue={selectedPrescription?.description}
                  {...register('description')}
                />
              </FormControl>
              <FormControl id="eat" mb="4">
                <FormLabel>Eat</FormLabel>
                <Select
                  defaultValue={selectedPrescription?.eat}
                  {...register('eat')}
                >
                  <option value="After">After</option>
                  <option value="Before">Before</option>
                  <option value="Free">Free</option>
                </Select>
              </FormControl>
              <FormControl id="routine" mb="4">
                <FormLabel>Routine</FormLabel>
                <Switch
                  defaultIsChecked={selectedPrescription?.routine}
                  colorScheme="purple"
                  size="lg"
                  {...register('routine')}
                />
              </FormControl>
              <FormControl id="start_at" mb="4">
                <FormLabel>Start at</FormLabel>
                <Controller
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Input
                        as={DayPickerInput}
                        value={value}
                        onDayChange={v => {
                          onChange(v);
                          setFrom(v);
                        }}
                        dayPickerProps={{
                          disabledDays: { after: to, before: new Date() },
                        }}
                      />
                    );
                  }}
                  control={control}
                  name="start_at"
                  defaultValue={new Date(selectedPrescription?.start_at)}
                />
              </FormControl>
              <FormControl id="end_at" mb="4">
                <FormLabel>End at</FormLabel>
                <Controller
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Input
                        as={DayPickerInput}
                        value={value}
                        onDayChange={v => {
                          onChange(v);
                          setTo(v);
                        }}
                        dayPickerProps={{
                          disabledDays: {
                            before: from
                              ? from
                              : new Date(selectedPrescription?.start_at),
                          },
                        }}
                      />
                    );
                  }}
                  control={control}
                  name="end_at"
                  defaultValue={new Date(selectedPrescription?.end_at)}
                />
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
