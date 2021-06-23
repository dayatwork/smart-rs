/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  SimpleGrid,
  Text,
  Input,
  FormErrorMessage,
  Textarea,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';

import { AuthContext } from '../../../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../../../api/institution-services/institution';
import { getFMS } from '../../../../../../../api/institution-services/fms';
import { getInstitutionRoles } from '../../../../../../../api/institution-services/role';
import {
  addStaff,
  checkEmployeeExists,
} from '../../../../../../../api/human-capital-services/employee';
import { BackButton } from '../../../../../../../components/shared/BackButton';
import { InputDate } from '../../../../../../../components/shared/input';

import religion from '../../../../../../../data/religion.json';
import gender from '../../../../../../../data/gender.json';
import maritalStatus from '../../../../../../../data/maritalStatus.json';
import nation from '../../../../../../../data/nation.json';

export const AddNewStaffPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const history = useHistory();
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [idStatus, setIdStatus] = useState('empty');
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    control,
    reset,
    clearErrors,
  } = useForm();
  const watchID = watch('employee_number');
  const queryClient = useQueryClient();

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const { data: resRole } = useQuery(
    'institution-roles',
    () => getInstitutionRoles(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const { data: resFMS } = useQuery(
    ['fms', selectedInstitution],
    () => getFMS(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution), staleTime: Infinity }
  );

  const { mutate } = useMutation(addStaff(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      if (data) {
        reset('');
        await queryClient.invalidateQueries(['employess', selectedInstitution]);
        setErrMessage('');
        // clearErrors();
        toast({
          title: 'Success',
          description: `Staff berhasil ditambahkan`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        history.push('/division/human-capital/staff');
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
      about,
      address,
      birth_date,
      birth_place,
      city,
      email,
      employee_number,
      fms,
      gender,
      marital_status,
      name,
      nationality,
      passport_number,
      phone_number,
      profession,
    } = values;

    const professionObj = JSON.parse(profession);

    const data = {
      institution_id: selectedInstitution,
      about,
      address,
      birth_date: new Date(birth_date).toISOString().split('T')[0],
      birth_place,
      regency: city,
      email,
      employee_number,
      functional_medical_staff_id: fms,
      gender,
      marital_status,
      name,
      nationality,
      passport_number,
      phone_number,
      role_id: professionObj.id,
      profession: professionObj.name,
      status: 'active',
    };

    await mutate(data);
  };

  const checkID = async () => {
    clearErrors('employee_number');
    if (!watchID) return;

    const json = await checkEmployeeExists(
      cookies,
      selectedInstitution,
      watchID
    );

    if (json.code === 404) {
      toast({
        title: 'ID Available',
        description: `ID belum terdaftarkan`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      setIdStatus('available');
    } else if (json.code === 200) {
      toast({
        title: 'ID Not Available',
        description: `ID sudah terdaftarkan`,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      setIdStatus('notAvailable');
      setError('employee_number', {
        message: 'Employee Number already exists',
      });
    }
  };

  return (
    <Box>
      <BackButton
        to="/division/human-capital/staff"
        text="Back to Staff List"
      />
      <Heading mb="6" fontSize="3xl">
        Add New Staff
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
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Box
            mb="10"
            rounded={{ md: 'lg' }}
            bg="white"
            shadow="base"
            maxW="5xl"
          >
            <Flex align="center" justify="space-between" px="6" py="4">
              <Text as="h3" fontWeight="bold" fontSize="lg">
                Personal
              </Text>
            </Flex>
            <Divider />
            <Box p="6">
              <SimpleGrid columns={2} gap="6">
                <FormControl id="name" isInvalid={errors.name ? true : false}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    {...register('name', { required: 'Name is required' })}
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  id="employee_number"
                  isInvalid={errors.employee_number ? true : false}
                >
                  <FormLabel>Employee Number</FormLabel>
                  <Flex>
                    <Input
                      borderColor={
                        idStatus === 'available' ? 'green.300' : 'gray.200'
                      }
                      {...register('employee_number', {
                        required: 'Employee Number is required',
                      })}
                      onBlur={checkID}
                    />
                  </Flex>
                  <FormErrorMessage>
                    {errors.employee_number && errors.employee_number.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl id="birth_place">
                  <FormLabel>Tempat Lahir</FormLabel>
                  <Input placeholder="Jakarta" {...register('birth_place')} />
                </FormControl>

                <FormControl id="birth_date">
                  <FormLabel>Date of Birth</FormLabel>
                  <InputDate name="birth_date" control={control} />
                </FormControl>
                <FormControl id="religion">
                  <FormLabel>Agama</FormLabel>
                  <Select placeholder="Pilih agama" {...register('religion')}>
                    {religion.map(type => (
                      <option value={type.value} key={type.value}>
                        {type.text}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="profession">
                  <FormLabel>Pekerjaan</FormLabel>
                  <Select {...register('profession')}>
                    <option value="">Pilih Profesi</option>
                    {resRole?.data.map(role => (
                      <option
                        value={JSON.stringify({
                          id: role.id,
                          name: role.name,
                        })}
                        key={role.id}
                      >
                        {role.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="gender">
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select
                    placeholder="Pilih jenis kelamin"
                    {...register('gender')}
                  >
                    {gender.map(type => (
                      <option value={type.value} key={type.value}>
                        {type.text}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="marital_status">
                  <FormLabel>Status Perkawinan</FormLabel>
                  <Select
                    placeholder="Pilih status perkawinan"
                    {...register('marital_status')}
                  >
                    {maritalStatus.map(type => (
                      <option value={type.text} key={type.value}>
                        {type.text}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="nationality">
                  <FormLabel>Kewarganegaraan</FormLabel>
                  <Select
                    placeholder="Pilih kewarganegaraan"
                    {...register('nationality')}
                  >
                    {nation.map(type => (
                      <option value={type.text} key={type.value}>
                        {type.text}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="fms" mb="4">
                  <FormLabel>SMF</FormLabel>
                  <Select {...register('fms')}>
                    <option value="">Pilih SMF</option>
                    {resFMS?.data.map(fms => (
                      <option key={fms.id} value={fms.id}>
                        {fms.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="identity_number">
                  <FormLabel>NIK</FormLabel>
                  <Input {...register('identity_number')} />
                </FormControl>
                <FormControl id="passport_number">
                  <FormLabel>Passport No</FormLabel>
                  <Input {...register('passport_number')} />
                </FormControl>
                <FormControl id="ktp">
                  <FormLabel>Photo KTP</FormLabel>
                  <Input type="file" p="0" py="0.5" name="ktp"></Input>
                </FormControl>
              </SimpleGrid>
            </Box>
          </Box>

          <Box rounded={{ md: 'lg' }} bg="white" shadow="base" maxW="5xl">
            <Flex align="center" justify="space-between" px="6" py="4">
              <Text as="h3" fontWeight="bold" fontSize="lg">
                Contact
              </Text>
            </Flex>
            <Divider />
            <Box p="6">
              <SimpleGrid columns={2} gap="6">
                <FormControl id="phone_number">
                  <FormLabel>Phone Number</FormLabel>
                  <Input type="number" {...register('phone_number')} />
                </FormControl>
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...register('email')} />
                </FormControl>
                <FormControl id="address">
                  <FormLabel>Address</FormLabel>
                  <Input {...register('address')} />
                </FormControl>
                <FormControl id="city">
                  <FormLabel>City</FormLabel>
                  <Input {...register('city')} />
                </FormControl>
                <FormControl id="about">
                  <FormLabel>About</FormLabel>
                  <Textarea {...register('about')} />
                </FormControl>
              </SimpleGrid>
            </Box>
          </Box>
          <Box textAlign="right" maxW="5xl" mt="6">
            <Button
              isLoading={isLoading}
              colorScheme="purple"
              type="submit"
              // onClick={handleSubmit(onSubmit)}
            >
              Add Staff
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
