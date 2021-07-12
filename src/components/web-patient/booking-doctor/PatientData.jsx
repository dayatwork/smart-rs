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
  Flex,
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
import { getResponsibleList } from '../../../api/patient-services/responsible';
import { InputDate } from '../../shared/input';

export const PatientData = ({
  patient,
  patientData,
  setPatientData,
  currentStepIndex,
  setCurrentStepIndex,
  // selectedResponsible,
  // setSelectedResponsible,
  responsibleDefaultValue,
  setResponsibleDefaultValue,
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
    mode: 'onBlur',
    defaultValues,
  });
  const [allergies, setAllergies] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoadingFetchProfile, setIsLoadingFetchProfile] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [selectedResponsible, setSelectedResponsible] = useState(
    responsibleDefaultValue?.email
  );
  // const [responsibleDefaultValue, setResponsibleDefaultValue] = useState({
  //   fullname: '',
  //   email: '',
  //   phone_number: '',
  //   identity_number: '',
  //   gender: '',
  //   marital_status: '',
  //   address: '',
  //   birth_date: new Date(),
  // });

  const queryClient = useQueryClient();
  const patientDataGridColumns = useBreakpointValue({
    base: 1,
    lg: patient === 'me' ? 2 : 1,
  });
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const profileInfoColumns = useBreakpointValue({ base: 1, md: 2 });

  const { data: dataResponsibleList } = useQuery('responsible-list', () =>
    getResponsibleList(cookies)
  );

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
        position: 'top-right',
        title: 'Success',
        description: 'Profile info dan health info berhasil di update',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoadingSubmit(true);
      toast({
        position: 'top-right',
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
    }
    // else {
    //   setDefaultValues({
    //     ...patientData,
    //     birth_date: new Date(),
    //   });
    //   reset({
    //     ...patientData,
    //     birth_date: new Date(),
    //   });
    // }
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
    if (patient !== 'me') {
      setDefaultValues({
        fullname: responsibleDefaultValue?.name || '',
        email: responsibleDefaultValue?.email || '',
        phone_number: responsibleDefaultValue?.phone_number || '',
        identity_number: responsibleDefaultValue?.identity_number || '',
        gender: responsibleDefaultValue?.gender || '',
        marital_status: responsibleDefaultValue?.marital_status || '',
        responsible_status: responsibleDefaultValue?.responsible_status || '',
        address: responsibleDefaultValue?.address || '',
        birth_date: responsibleDefaultValue?.birth_date
          ? new Date(responsibleDefaultValue?.birth_date)
          : new Date(),
      });
      reset({
        fullname: responsibleDefaultValue?.name || '',
        email: responsibleDefaultValue?.email || '',
        phone_number: responsibleDefaultValue?.phone_number || '',
        identity_number: responsibleDefaultValue?.identity_number || '',
        gender: responsibleDefaultValue?.gender || '',
        marital_status: responsibleDefaultValue?.marital_status || '',
        responsible_status: responsibleDefaultValue?.responsible_status || '',
        address: responsibleDefaultValue?.address || '',
        birth_date: responsibleDefaultValue?.birth_date
          ? new Date(responsibleDefaultValue?.birth_date)
          : new Date(),
      });
    }
  }, [patient, responsibleDefaultValue, reset]);

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
          emptyColor="secondary.light"
          color="secondary.dark"
          size="xl"
        />
      </Center>
    );
  }

  // console.log({ responsibleDefaultValue });

  return (
    <>
      {patient !== 'me' && (
        <FormControl maxW="4xl" mx="auto" mb="6">
          <FormLabel>Pilih Pasien (Jika sudah pernah mendaftar)</FormLabel>
          <Select
            bg="white"
            onChange={e => {
              setSelectedResponsible(e.target.value);
              const patient = dataResponsibleList?.data?.patients?.find(
                patient => patient.email === e.target.value
              );
              setResponsibleDefaultValue(patient);
            }}
            value={selectedResponsible}
          >
            <option value="">Pasien baru</option>
            {dataResponsibleList?.data?.patients?.map(patient => (
              <option key={patient.id} value={patient.email}>
                {patient.name}
              </option>
            ))}
          </Select>
        </FormControl>
      )}
      <SimpleGrid
        // columns={patient === 'me' ? 2 : 1}
        columns={patientDataGridColumns}
        gap="8"
        maxW="4xl"
        mx="auto"
        pb={{ base: '20', md: '28' }}
      >
        <VStack
          spacing="3"
          bg="white"
          boxShadow="md"
          px={{ base: '6', md: '10' }}
          pt="4"
          pb="8"
          rounded="md"
        >
          <Heading fontSize="xl" fontWeight="bold" mb="4">
            Profile Info
          </Heading>
          <SimpleGrid
            columns={patient === 'me' ? 1 : profileInfoColumns}
            w="full"
            rowGap="4"
            columnGap={{ base: '6', md: '10' }}
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
                // variant={patient === 'me' ? 'filled' : 'outline'}
                readOnly={patient === 'me' || selectedResponsible}
                // {...register('email', {
                //   required: 'Email harus diisi',
                // })}
                {...register('email', {
                  required: 'Email harus diisi',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email tidak valid',
                  },
                })}
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
                  <option value="husband">Suami</option>
                  <option value="wife">Istri</option>
                  <option value="father">Ayah</option>
                  <option value="mother">Ibu</option>
                  <option value="child">Anak</option>
                  <option value="sibling">Saudara</option>
                  <option value="friend">Teman</option>
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
            px={{ base: '6', md: '10' }}
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
      <Box
        h={{ base: '20', md: '28' }}
        bg="primary.500"
        position="fixed"
        bottom="0"
        left="0"
        w="full"
        zIndex="5"
      >
        <Flex
          h="full"
          maxW="7xl"
          mx="auto"
          justify={{ base: 'center', md: 'flex-end' }}
          align="center"
          px="4"
        >
          <Button
            leftIcon={<FaArrowLeft />}
            onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
            size={buttonSize}
            bgColor="secondary.light"
            color="secondary.dark"
            _hover={{
              bgColor: 'secondary.dark',
              color: 'secondary.light',
            }}
          >
            Back
          </Button>
          <Button
            rightIcon={<FaArrowRight />}
            bgColor="secondary.light"
            color="secondary.dark"
            _hover={{
              bgColor: 'secondary.dark',
              color: 'secondary.light',
            }}
            ml="2"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoadingSubmit}
            size={buttonSize}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </>
  );
};
