/* eslint-disable react/display-name */
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Button,
  Text,
  Input,
  useToast,
  Flex,
  VisuallyHidden,
  CheckboxGroup,
  HStack,
  Checkbox,
  Textarea,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import ReactSelect from 'react-select';

import { AuthContext } from '../../../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../../../api/institution-services/institution';
import { BackButton } from '../../../../../../../components/shared/BackButton';
import { getServices } from '../../../../../../../api/institution-services/service';
import { getEventNodes } from '../../../../../../../api/institution-services/event-node';
import { createServicePrice } from '../../../../../../../api/finance-services/service-price';
import { InputDate } from '../../../../../../../components/shared/input';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../../access-control';

export const CreateServicePricePage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const history = useHistory();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [eventNode, setEventNode] = useState([]);
  const { register, handleSubmit, reset, watch, control } = useForm();
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [patientType, setPatientType] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const pricesWatch = watch('prices');
  const queryClient = useQueryClient();

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const { data: resServices } = useQuery(
    ['services', selectedInstitution],
    () => getServices(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const { data: resEventNode } = useQuery(
    ['event-nodes-institution', selectedInstitution],
    () => getEventNodes(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
    }
  );

  useEffect(() => {
    const totalPrice =
      pricesWatch
        ?.map(price => Number(price.price))
        .reduce((acc, cur) => acc + cur, 0) || 0;
    setTotalPrice(totalPrice);
  }, [pricesWatch]);

  const onSubmit = async value => {
    const { service, prices, note, name, start_date } = value;

    const payload = {
      institution_id: selectedInstitution,
      department_id: null,
      service_id: JSON.parse(service).id,
      name: name,
      currency: 'IDR',
      total_price: prices
        .map(price => Number(price.price))
        .reduce((acc, cur) => acc + cur, 0),
      patient_type: patientType,
      tax: null,
      payment_method: paymentMethod,
      date: new Date(start_date).toISOString().split('T')[0],
      data: prices.map(price => ({ ...price, price: Number(price.price) })),
      note,
    };

    try {
      setIsLoading(true);
      await createServicePrice(cookies)(payload);
      await queryClient.invalidateQueries([
        'service-price',
        selectedInstitution,
      ]);
      setIsLoading(false);
      setEventNode([]);
      setPatientType([]);
      setPaymentMethod([]);
      reset({ service: '', note: '', name: '' });
      toast({
        title: 'Success',
        description: `Tarif layanan berhasil ditambahkan`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      history.replace('/division/finance/service');
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: `Tarif gagal ditambahkan`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <BackButton to="/division/finance/service" text="Back to Service Price" />
      <Heading mb="6" fontSize="3xl">
        Create Service Price
      </Heading>

      {user?.role?.alias === 'super-admin' && (
        <FormControl id="name" mb="4" maxW="xs">
          <FormLabel>Institution</FormLabel>
          <Select
            name="institution"
            value={selectedInstitution}
            onChange={e => setSelectedInstitution(e.target.value)}
          >
            <option value="">Select Institution</option>
            {isSuccessInstitution &&
              resInstitution?.data?.map(institution => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
          </Select>
        </FormControl>
      )}

      {selectedInstitution && (
        <Box bg="white" shadow="base" py="4" px="6" maxW="4xl">
          <FormControl id="service" mb="6">
            <FormLabel>Pilih Layanan</FormLabel>
            <Select {...register('service')}>
              <option value="">Pilih Layanan</option>
              {resServices?.data?.map(service => {
                return (
                  <option
                    key={service.id}
                    value={JSON.stringify({
                      id: service.id,
                      name: service.name,
                    })}
                  >
                    {service.name}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl id="name" mb="6">
            <FormLabel>Nama Tarif</FormLabel>
            <Input {...register('name')} />
          </FormControl>
          <FormControl id="event_node" mb="6">
            <FormLabel>Pilih Event Node</FormLabel>
            <ReactSelect
              defaultValue={[]}
              isMulti
              name="event_node"
              options={resEventNode?.data?.map(event => ({
                label: event.name,
                value: event.id,
              }))}
              value={eventNode}
              onChange={setEventNode}
            />
          </FormControl>
          <FormControl mb="6">
            <FormLabel>Prices</FormLabel>
            {eventNode.length ? (
              <Box>
                {eventNode?.map((event, index) => {
                  return (
                    <Flex key={event.value} align="center" mb="2">
                      <FormControl display="none" id={event.label}>
                        <FormLabel>Event Node</FormLabel>
                        <Input
                          // display="none"
                          defaultValue={event.value}
                          {...register(`prices[${index}].event_node_id`)}
                          // disabled
                        ></Input>
                      </FormControl>
                      <Text w="36" fontWeight="semibold" color="gray.600">
                        {event.label}
                      </Text>
                      <FormControl id={event.label} maxW="32">
                        <VisuallyHidden>Price</VisuallyHidden>
                        <Input
                          type="number"
                          defaultValue={0}
                          {...register(`prices[${index}].price`)}
                        ></Input>
                      </FormControl>
                    </Flex>
                  );
                })}
                <Flex align="center">
                  <Text w="36" fontWeight="bold" color="gray.600">
                    Total
                  </Text>
                  <FormControl id="total" maxW="32">
                    <VisuallyHidden>Total</VisuallyHidden>
                    <Text py="2" px="4">
                      {totalPrice}
                    </Text>
                  </FormControl>
                </Flex>
              </Box>
            ) : (
              <Text>empty</Text>
            )}
          </FormControl>
          <FormControl mb="6">
            <FormLabel>Patient Type</FormLabel>
            <CheckboxGroup
              colorScheme="purple"
              value={patientType}
              onChange={setPatientType}
            >
              <HStack spacing="6">
                <Checkbox value="umum">Umum</Checkbox>
                <Checkbox value="bpjs">BPJS</Checkbox>
                <Checkbox value="kerjasama">Kerjasama</Checkbox>
                <Checkbox value="lain-lain">Lain-lain</Checkbox>
              </HStack>
            </CheckboxGroup>
          </FormControl>
          <FormControl mb="6">
            <FormLabel>Payment Method</FormLabel>
            <CheckboxGroup
              colorScheme="purple"
              value={paymentMethod}
              onChange={setPaymentMethod}
            >
              <HStack spacing="6">
                <Checkbox value="cash">Cash</Checkbox>
                <Checkbox value="credit">Credit</Checkbox>
                <Checkbox value="sehat-pay">Sehat Pay</Checkbox>
                <Checkbox value="transfer">Transfer</Checkbox>
              </HStack>
            </CheckboxGroup>
          </FormControl>
          <FormControl mb="6">
            <FormLabel>Start Date</FormLabel>
            <InputDate name="start_date" control={control} />
          </FormControl>
          <FormControl mb="6">
            <FormLabel>Note</FormLabel>
            <Textarea maxW="md" {...register('note')} />
          </FormControl>
          <PrivateComponent permission={Permissions.createServicePrice}>
            <Flex justify="flex-end" mt="8">
              <Button
                onClick={handleSubmit(onSubmit)}
                colorScheme="purple"
                isLoading={isLoading}
              >
                Create
              </Button>
            </Flex>
          </PrivateComponent>
        </Box>
      )}
    </Box>
  );
};
