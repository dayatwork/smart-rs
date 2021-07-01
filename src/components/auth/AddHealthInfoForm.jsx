import React, { useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Stack,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import bloodType from '../../data/bloodType.json';
import { getPatientVitalSign } from '../../api/medical-record-services/vital-sign';

export const AddHealthInfoForm = ({ onSubmit, isLoading }) => {
  const [cookies] = useCookies(['token']);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data: dataPatientVitalSign, isLoading: isLoadingPatientVitalSign } =
    useQuery(
      ['patient-vital-sign', cookies?.user?.id],
      () => getPatientVitalSign(cookies, cookies?.user?.id),
      { enabled: Boolean(cookies?.user?.id), staleTime: 600000 }
    );

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

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="2">
        <FormControl
          id="blood_type"
          isInvalid={errors.blood_type ? true : false}
        >
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
            type="number"
            isDisabled={isLoadingPatientVitalSign}
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
        <Button
          type="submit"
          colorScheme="primary"
          size="lg"
          fontSize="md"
          isLoading={isLoading}
        >
          Simpan & Lanjutkan
        </Button>
      </Stack>
    </Box>
  );
};
