import React, { useState } from 'react';
import {
  Box,
  Heading,
  Button,
  Flex,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  Checkbox,
  ModalFooter,
  Input,
  Select,
  Divider,
  Center,
  Spinner,
  useToast,
  UnorderedList,
  ListItem,
  Switch,
} from '@chakra-ui/react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useCookies } from 'react-cookie';

import { createPatientPrescription } from '../../../../../../../api/medical-record-services/soap';
import { getPatientAllergies } from '../../../../../../../api/medical-record-services/allergies';
import { getDrugs } from '../../../../../../../api/pharmacy-services/drug';

export const AddPrescriptionModal = ({ isOpen, onClose, patientDetail, dataSoap }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const [internalPharmacy, setInternalPharmacy] = useState(true);

  const { register, handleSubmit, reset, control, clearErrors } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medicines',
  });

  const {
    data: dataPatientAllergies,
    isLoading: isLoadingPatientAllergies,
    isSuccess: isSuccessPatientAllergies,
  } = useQuery(
    ['patient-allergies', patientDetail?.patient_id],
    () => getPatientAllergies(cookies, patientDetail?.patient_id),
    { enabled: Boolean(patientDetail?.patient_id) },
  );

  const { data: dataDrugs } = useQuery(
    ['drugs', dataSoap?.institution_id],
    () => getDrugs(cookies, dataSoap?.institution_id),
    { enabled: Boolean(dataSoap?.institution_id) },
  );

  const queryClient = useQueryClient();

  const { mutate } = useMutation(createPatientPrescription(cookies), {
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
          title: 'Success',
          description: `Prescription added successfully`,
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
    const formattedMedicines = values.medicines.map((medicine) => ({
      drug_id: JSON.parse(medicine?.drug).id,
      drug_name: JSON.parse(medicine?.drug).name,
      quantity: medicine.quantity,
      frequency: medicine.frequency,
      description: medicine.description,
      eat: medicine.eat,
      start_at: new Date(medicine.start_at).toISOString().split('T')[0],
      end_at: new Date(medicine.end_at).toISOString().split('T')[0],
      routine: medicine.routine,
    }));

    const data = {
      soap_plan_id: dataSoap?.soap_plans[0]?.id,
      institution_id: dataSoap?.institution_id,
      patient_id: dataSoap?.patient_id,
      user_id: patientDetail?.patient?.user_id,
      internal_pharmacy: internalPharmacy,
      data: formattedMedicines,
      transaction_number: dataSoap?.transaction_number,
    };

    await mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="7xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Prescription</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={2} gap="3">
            <Box p="4">
              <Heading as="h3" fontSize="xl" mb="2" color="purple.500">
                Allergies
              </Heading>
              {isLoadingPatientAllergies && (
                <Center py="6">
                  <Spinner />
                </Center>
              )}
              {isSuccessPatientAllergies && (
                <SimpleGrid columns={3} px="3" gap="4">
                  <Box p="2">
                    <Heading as="h4" fontSize="md" fontWeight="medium" mb="1.5">
                      Drug
                    </Heading>
                    <UnorderedList>
                      {dataPatientAllergies?.data?.Drugs?.map((drug) => (
                        <ListItem key={drug.id}>{drug.name}</ListItem>
                      ))}
                    </UnorderedList>
                  </Box>
                  <Box p="2">
                    <Heading as="h4" fontSize="md" fontWeight="medium" mb="1.5">
                      Food
                    </Heading>

                    <UnorderedList>
                      {dataPatientAllergies?.data?.Food?.map((food) => (
                        <ListItem key={food.id}>{food.name}</ListItem>
                      ))}
                    </UnorderedList>
                  </Box>
                  <Box p="2">
                    <Heading as="h4" fontSize="md" fontWeight="medium" mb="1.5">
                      Others
                    </Heading>

                    <UnorderedList>
                      {dataPatientAllergies?.data?.Others?.map((allergy) => (
                        <ListItem key={allergy.id}>{allergy.name}</ListItem>
                      ))}
                    </UnorderedList>
                  </Box>
                </SimpleGrid>
              )}
            </Box>
            <Box p="4">
              <Heading as="h3" fontSize="xl" mb="2" color="purple.500">
                Medical Routine
              </Heading>
              <Box>
                <Table fontSize="sm" variant="simple" border="1px" borderColor="gray.200">
                  <Thead bg="gray.100">
                    <Tr>
                      <Th>Item</Th>
                      <Th>Frequency</Th>
                      <Th>Duration to eat</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Medicine 1</Td>
                      <Td>3 times/day</Td>
                      <Td>12 Sept - 17 Sept 2021</Td>
                    </Tr>
                    <Tr>
                      <Td>Medicine 2</Td>
                      <Td>3 times/day</Td>
                      <Td>12 Sept - 17 Sept 2021</Td>
                    </Tr>
                    <Tr>
                      <Td>Medicine 3</Td>
                      <Td>3 times/day</Td>
                      <Td>12 Sept - 17 Sept 2021</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </SimpleGrid>
          <Divider mt="2" mb="4" />

          <Box px="4">
            <Heading fontSize="lg" color="purple.500" mb="2">
              Medicine
            </Heading>

            <FormControl display="flex" alignItems="center" mb="4">
              <FormLabel htmlFor="internal_farmacy" mb="0">
                Internal pharmacy?
              </FormLabel>
              <Switch
                id="internal_farmacy"
                value={internalPharmacy}
                onChange={() => setInternalPharmacy((prev) => !prev)}
                isChecked={internalPharmacy}
                colorScheme="purple"
                size="md"
              />
            </FormControl>
            <Table variant="simple" size="sm" border="1px" borderColor="gray.200">
              <Thead bgColor="gray.100">
                <Tr>
                  <Th>Drug</Th>
                  <Th>Quantity</Th>
                  <Th>Frequency</Th>
                  <Th>Description</Th>
                  <Th>Eat</Th>
                  <Th>Routine</Th>
                  <Th>Start at</Th>
                  <Th>End at</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                </Tr> */}
                {fields.map((field, index) => {
                  return (
                    <DrugInput
                      key={field.id}
                      field={field}
                      register={register}
                      remove={remove}
                      index={index}
                      dataDrugs={dataDrugs}
                      control={control}
                    />
                  );
                })}
              </Tbody>
            </Table>
            <Box textAlign="center" mt="4">
              <Button
                leftIcon={<FaPlus />}
                type="button"
                onClick={() => append({})}
                // w="full"
              >
                Add Medicine
              </Button>
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="purple"
            isLoading={isLoading}
            onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const DrugInput = ({ field, remove, register, index, dataDrugs, control }) => {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  return (
    <Tr key={field.id}>
      <Td>
        <Select {...register(`medicines[${index}].drug`)}>
          <option value="">Select Medicine</option>
          {dataDrugs?.data?.map((drug) => (
            <option
              key={drug.id}
              value={JSON.stringify({
                id: drug.id,
                name: drug.name,
              })}>
              {drug.name}
            </option>
          ))}
        </Select>
      </Td>
      <Td w="36">
        <Flex align="center">
          <Input type="number" {...register(`medicines[${index}].quantity`)} />
          <Box as="span" ml="1" fontWeight="semibold">
            ml
          </Box>
        </Flex>
      </Td>
      <Td w="36">
        <Flex align="center">
          <Input type="number" {...register(`medicines[${index}].frequency`)} />
          <Box as="span" ml="1" fontWeight="semibold">
            x/hari
          </Box>
        </Flex>
      </Td>
      <Td>
        <Input {...register(`medicines[${index}].description`)} />
      </Td>
      <Td w="40">
        <Select {...register(`medicines[${index}].eat`)}>
          <option value="After">After</option>
          <option value="Before">Before</option>
          <option value="Free">Free</option>
        </Select>
      </Td>
      <Td w="20">
        <Checkbox colorScheme="purple" {...register(`medicines[${index}].routine`)} />
      </Td>
      <Td w="44">
        <Controller
          render={({ field: { value, onChange } }) => {
            return (
              <Input
                as={DayPickerInput}
                value={value}
                onDayChange={(v) => {
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
          name={`medicines[${index}].start_at`}
          defaultValue={null}
        />
      </Td>
      <Td w="44">
        <Controller
          render={({ field: { value, onChange } }) => {
            return (
              <Input
                as={DayPickerInput}
                value={value}
                onDayChange={(v) => {
                  onChange(v);
                  setTo(v);
                }}
                dayPickerProps={{
                  disabledDays: { before: from },
                }}
              />
            );
          }}
          control={control}
          name={`medicines[${index}].end_at`}
          defaultValue={null}
        />
      </Td>
      <Td>
        <IconButton as={FaTrashAlt} p="3" colorScheme="red" onClick={remove} />
      </Td>
    </Tr>
  );
};
