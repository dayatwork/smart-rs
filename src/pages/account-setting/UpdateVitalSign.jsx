import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import ReactSelect from 'react-select';

import bloodType from '../../data/bloodType.json';
import { createUserVitalSign } from '../../api/user-services/user-management';
import { getPatientVitalSign } from '../../api/medical-record-services/vital-sign';
import { getPatientAllergies } from '../../api/medical-record-services/allergies';
import { getAllergiesByGroup } from '../../api/master-data-services/allergies';

export const UpdateVitalSign = () => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [allergies, setAllergies] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoadingUpdateVitalSign, setIsLoadingUpdateVitalSign] =
    useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();

  const { data: dataAllergies, isLoading: isLoadingAllergies } = useQuery(
    'allergies-group',
    () => getAllergiesByGroup(cookies),
    { staleTime: Infinity }
  );

  const { data: dataPatientAllergies, isLoading: isLoadingPatientAllergies } =
    useQuery(
      ['patient-allergy', cookies.user.id],
      () => getPatientAllergies(cookies, cookies.user.id),
      { enabled: Boolean(cookies.user.id) }
    );

  const { data: dataPatientVitalSign, isLoading: isLoadingPatientVitalSign } =
    useQuery(['patient-vital-sign', cookies?.user?.id], () =>
      getPatientVitalSign(cookies, cookies?.user?.id)
    );

  useEffect(() => {
    if (dataPatientAllergies?.code === 404) {
      return;
    }
    const patientAllergies = [];
    if (dataPatientAllergies?.data) {
      Object.entries(dataPatientAllergies?.data).forEach(([key, value]) => {
        return value?.forEach(v =>
          patientAllergies.push({ label: v.name, value: v.id })
        );
      });
    }
    setAllergies(patientAllergies);
  }, [dataPatientAllergies?.code, dataPatientAllergies?.data]);

  useEffect(() => {
    setOptions([
      {
        label: 'Obat-obatan',
        options: dataAllergies?.data?.Drugs.map(drug => ({
          label: drug.name,
          value: drug.id,
        })),
      },
      {
        label: 'Makanan',
        options: dataAllergies?.data?.Food?.map(food => ({
          label: food.name,
          value: food.id,
        })),
      },
      {
        label: 'Lain-lain',
        options: dataAllergies?.data?.Others?.map(allergy => ({
          label: allergy.name,
          value: allergy.id,
        })),
      },
    ]);
  }, [
    dataAllergies?.data?.Drugs,
    dataAllergies?.data?.Food,
    dataAllergies?.data?.Others,
  ]);

  useEffect(() => {
    reset({
      blood_type: dataPatientVitalSign?.data?.blood_type,
      height: dataPatientVitalSign?.data?.height,
      weight: dataPatientVitalSign?.data?.weight,
    });
  }, [
    dataPatientVitalSign?.data?.blood_type,
    dataPatientVitalSign?.data?.height,
    dataPatientVitalSign?.data?.weight,
    reset,
  ]);

  const onSubmit = async values => {
    const { height, weight, blood_type } = values;
    const data = {
      height,
      weight,
      blood_type,
      allergies: allergies.length
        ? allergies?.map(allergy => allergy.value)
        : null,
    };

    try {
      setIsLoadingUpdateVitalSign(true);
      await createUserVitalSign(cookies, data);
      await queryClient.invalidateQueries(['patient-allergy', cookies.user.id]);
      await queryClient.invalidateQueries([
        'patient-vital-sign',
        cookies?.user?.id,
      ]);
      setIsLoadingUpdateVitalSign(false);
      toast({
        title: 'Success',
        description: 'Health info berhasil di update',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoadingUpdateVitalSign(false);
      toast({
        title: 'Error',
        description: 'Health info gagal di update',
        status: 'Error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack width="full" spacing="6">
      <FormControl id="blood_type" isInvalid={errors.blood_type ? true : false}>
        <FormLabel>Golongan Darah</FormLabel>
        <Select
          isDisabled={isLoadingPatientVitalSign}
          {...register('blood_type', {
            required: 'Golongan darah harus diisi',
          })}
        >
          <option value="">Pilih Golongan Darah</option>
          {bloodType.map(type => (
            <option key={type.value} value={type.value}>
              {type.text}
            </option>
          ))}
        </Select>
        <FormErrorMessage>
          {errors.blood_type && errors.blood_type.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl id="height" isInvalid={errors.height ? true : false}>
        <FormLabel>Tinggi Badan (cm)</FormLabel>
        <Input
          isDisabled={isLoadingPatientVitalSign}
          type="number"
          {...register('height', { required: 'Tinggi badan harus diisi' })}
        />
        <FormErrorMessage>
          {errors.height && errors.height.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl id="weight" isInvalid={errors.weight ? true : false}>
        <FormLabel>Berat Badan (kg)</FormLabel>
        <Input
          type="number"
          isDisabled={isLoadingPatientVitalSign}
          {...register('weight', { required: 'Berat badan harus diisi' })}
        />
        <FormErrorMessage>
          {errors.weight && errors.weight.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl id="allergies" mb="2">
        <FormLabel>Alergi</FormLabel>
        <ReactSelect
          options={options}
          isMulti
          isLoading={isLoadingAllergies || isLoadingPatientAllergies}
          value={allergies}
          onChange={setAllergies}
        ></ReactSelect>
      </FormControl>
      <Button
        alignSelf="end"
        onClick={handleSubmit(onSubmit)}
        isLoading={isLoadingUpdateVitalSign}
        isDisabled={isLoadingPatientVitalSign || isLoadingPatientAllergies}
      >
        Save Changes
      </Button>
    </VStack>
  );
};
