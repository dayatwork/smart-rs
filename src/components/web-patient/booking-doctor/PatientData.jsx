import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  SimpleGrid,
  Input,
  VStack,
  Box,
  Button,
  Heading,
  Select,
  FormErrorMessage,
  Center,
  Spinner,
  useToast,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import ReactSelect from 'react-select';
import format from 'date-fns/format';

import bloodType from '../../../data/bloodType.json';
import maritalStatusData from '../../../data/maritalStatus.json';
import {
  getUserProfile,
  createUserVitalSign,
  updateUserDetail,
} from '../../../api/user-services/user-management';
import { getPatientVitalSign } from '../../../api/medical-record-services/vital-sign';
import { getPatientAllergies } from '../../../api/medical-record-services/allergies';
import { getAllergiesByGroup } from '../../../api/master-data-services/allergies';
import { InputDate } from '../../shared/input';

export const PatientData = ({
  patient,
  patientData,
  setPatientData,
  currentStepIndex,
  setCurrentStepIndex,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['user']);
  const [defaultValues, setDefaultValues] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
  });
  const [allergies, setAllergies] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoadingFetchProfile, setIsLoadingFetchProfile] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const queryClient = useQueryClient();
  const patientDataGridColumns = useBreakpointValue({
    base: 1,
    lg: patient === 'me' ? 2 : 1,
  });

  const { data: dataAllergies, isLoading: isLoadingAllergies } = useQuery(
    'allergies-group',
    () => getAllergiesByGroup(cookies)
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
      Object.entries(dataPatientAllergies?.data).forEach(([, value]) => {
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
    // console.log({ values });
    if (patient !== 'me') {
      const {
        fullname,
        email,
        phone_number,
        birth_date,
        identity_number,
        gender,
        marital_status,
        responsible_status,
        address,
      } = values;
      const data = {
        fullname,
        email,
        phone_number,
        birth_date: format(birth_date, 'dd-MM-yyyy'),
        identity_number,
        gender,
        marital_status,
        responsible_status,
        address,
      };
      setPatientData(data);
      setCurrentStepIndex(currentStepIndex + 1);
      return;
    }
    // console.log({ values });
    const { height, weight, blood_type } = values;
    const data = {
      height,
      weight,
      blood_type,
      allergies: allergies.length
        ? allergies?.map(allergy => allergy.value)
        : null,
    };

    setPatientData({
      ...values,
      birth_date: values.birth_date && format(values.birth_date, 'dd-MM-yyyy'),
      allergies,
    });

    const dataUser = {
      name: values.fullname,
      email: values.email,
      phone_number: values.phone_number,
      birth_date: values.birth_date,
      identity_number: values.identity_number,
      gender: values.gender,
      marital_status: values.marital_status,
      address: values.address,
    };

    try {
      setIsLoadingSubmit(true);
      await createUserVitalSign(cookies, data);
      await queryClient.invalidateQueries(['patient-allergy', cookies.user.id]);
      await queryClient.invalidateQueries([
        'patient-vital-sign',
        cookies?.user?.id,
      ]);
      await updateUserDetail(cookies)(dataUser);
      setIsLoadingSubmit(true);
      setCurrentStepIndex(currentStepIndex + 1);
      toast({
        title: 'Success',
        description: 'Profile info dan health info berhasil di update',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoadingSubmit(true);
      toast({
        title: 'Error',
        description: 'Profile info dan health info gagal di update',
        status: 'Error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (patient === 'me') {
      setDefaultValues({
        ...patientData,
        fullname: cookies.user.name,
        blood_type: dataPatientVitalSign?.data?.blood_type,
        height: dataPatientVitalSign?.data?.height,
        weight: dataPatientVitalSign?.data?.weight,
      });
      reset({
        ...patientData,
        fullname: cookies.user.name,
        blood_type: dataPatientVitalSign?.data?.blood_type,
        height: dataPatientVitalSign?.data?.height,
        weight: dataPatientVitalSign?.data?.weight,
      });
    } else {
      setDefaultValues({
        ...patientData,
        birth_date: new Date(),
      });
      reset({
        ...patientData,
        birth_date: new Date(),
      });
    }
  }, [
    patient,
    cookies,
    reset,
    patientData,
    dataPatientVitalSign?.data?.blood_type,
    dataPatientVitalSign?.data?.height,
    dataPatientVitalSign?.data?.weight,
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoadingFetchProfile(true);
      const fetchedProfile = await getUserProfile(cookies?.token);
      setPatientData(prev => ({
        ...prev,
        phone_number: Number(fetchedProfile?.data?.phone_number),
        email: fetchedProfile?.data?.email,
        identity_number: Number(
          fetchedProfile?.data?.usersId[0]?.identity_number
        ),
        gender: fetchedProfile?.data?.usersId[0]?.gender,
        marital_status: fetchedProfile?.data?.usersId[0]?.marital_status,
        address: fetchedProfile?.data?.usersId[0]?.address,
        birth_date: new Date(fetchedProfile?.data?.usersId[0]?.birth_date),
      }));
      setIsLoadingFetchProfile(false);
    };

    if (patient === 'me') {
      fetchProfile();
    }
  }, [cookies, setPatientData, patient]);

  if (
    patient === 'me' &&
    (isLoadingFetchProfile || isLoadingPatientVitalSign)
  ) {
    return (
      <Center h="48">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <>
      <SimpleGrid
        // columns={patient === 'me' ? 2 : 1}
        columns={patientDataGridColumns}
        gap="8"
        maxW="4xl"
        mx="auto"
      >
        <VStack
          spacing="3"
          bg="white"
          boxShadow="md"
          px="10"
          pt="4"
          pb="8"
          rounded="md"
        >
          <Heading fontSize="xl" fontWeight="bold" mb="4">
            Profile Info
          </Heading>
          <SimpleGrid
            columns={patient === 'me' ? 1 : 2}
            w="full"
            rowGap="3"
            columnGap="10"
          >
            <FormControl
              id="fullname"
              isInvalid={errors.fullname ? true : false}
            >
              <FormLabel>Nama Lengkap</FormLabel>
              <Input
                {...register('fullname', {
                  required: 'Nama lengkap harus diisi',
                })}
              />
              <FormErrorMessage>
                {errors.fullname && errors.fullname.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="email" isInvalid={errors.email ? true : false}>
              <FormLabel>Email</FormLabel>
              <Input
                readOnly={patient === 'me'}
                {...register('email', { required: 'Email harus diisi' })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="phone_number"
              isInvalid={errors.phone_number ? true : false}
            >
              <FormLabel>No Hp</FormLabel>
              <Input
                type="number"
                {...register('phone_number', {
                  required: 'Nomor HP harus diisi',
                })}
              />
              <FormErrorMessage>
                {errors.phone_number && errors.phone_number.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="birth_date"
              isInvalid={errors.birth_date ? true : false}
            >
              <FormLabel>Tanggal Lahir</FormLabel>
              <InputDate name="birth_date" control={control} />
              <FormErrorMessage>
                {errors.birth_date && errors.birth_date.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="identity_number"
              isInvalid={errors.identity_number ? true : false}
            >
              <FormLabel>NIK</FormLabel>
              <Input
                type="number"
                onInput={e =>
                  setValue(
                    'identity_number',
                    e.target.value.slice(0, e.target.maxLength)
                  )
                }
                maxLength="16"
                {...register('identity_number', {
                  required: 'NIK harus diisi',
                  maxLength: 16,
                })}
              />
              <FormErrorMessage>
                {errors.identity_number && errors.identity_number.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl id="gender" isInvalid={errors.gender ? true : false}>
              <FormLabel>Jenis Kelamin</FormLabel>
              <Select
                {...register('gender', {
                  required: 'Jenis kelamin harus diisi',
                })}
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </Select>
              <FormErrorMessage>
                {errors.gender && errors.gender.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="marital_status"
              isInvalid={errors.marital_status ? true : false}
            >
              <FormLabel>Status Perkawinan</FormLabel>
              <Select
                {...register('marital_status', {
                  required: 'Status perkawinan harus diisi',
                })}
              >
                <option value="">Pilih status perkawinan</option>
                {maritalStatusData.map(status => (
                  <option value={status.value} key={status.value}>
                    {status.text}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.marital_status && errors.marital_status.message}
              </FormErrorMessage>
            </FormControl>
            {patient !== 'me' && (
              <FormControl id="responsible_status" w="full">
                <FormLabel>Status Penanggung Jawab</FormLabel>
                <Select
                  {...register('responsible_status', {
                    required: 'Status perkawinan harus diisi',
                  })}
                >
                  <option>Pilih status penanggung jawab</option>
                  <option value="suami-istri">Suami/istri</option>
                  <option value="orang-tua">Orang tua</option>
                  <option value="anak">Anak</option>
                  <option value="lainnya">Lainnya</option>
                </Select>
              </FormControl>
            )}
            <FormControl id="address" w="full">
              <FormLabel>Alamat</FormLabel>
              <Input type="text" {...register('address')} />
            </FormControl>
          </SimpleGrid>
        </VStack>
        {patient === 'me' && (
          <VStack
            spacing="3"
            bg="white"
            boxShadow="md"
            px="10"
            pt="4"
            pb="8"
            rounded="md"
          >
            <Heading fontSize="xl" fontWeight="bold" mb="4">
              Health Info
            </Heading>
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
                {...register('height', {
                  required: 'Tinggi badan harus diisi',
                })}
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
          </VStack>
        )}
      </SimpleGrid>

      <Box mt="14" textAlign="right">
        <Button
          leftIcon={<FaArrowLeft />}
          onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
        >
          Back
        </Button>
        <Button
          rightIcon={<FaArrowRight />}
          colorScheme="blue"
          ml="2"
          onClick={handleSubmit(onSubmit)}
          isLoading={isLoadingSubmit}
        >
          Next
        </Button>
      </Box>
    </>
  );
};
