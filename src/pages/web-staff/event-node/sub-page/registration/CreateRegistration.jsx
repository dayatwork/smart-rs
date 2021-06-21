import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Divider,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Grid,
  GridItem,
  Select,
  useToast,
  FormHelperText,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FaPrint } from 'react-icons/fa';
import QRCode from 'qrcode.react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import religionData from '../../../../../data/religion.json';
import genderData from '../../../../../data/gender.json';
import maritalStatusData from '../../../../../data/maritalStatus.json';
import nationData from '../../../../../data/nation.json';
import { registerPatient } from '../../../../../api/patient-services/patient';
import { getUsersByIdentity } from '../../../../../api/user-services/user-management';
import { getInstitutions } from '../../../../../api/institution-services/institution';
import { Logo } from '../../../../../components/shared/Logo';
import {
  InputDate,
  SelectCity,
  SelectProvince,
  SelectDistrict,
  SelectSubDistrict,
} from '../../../../../components/shared/input';
import { BackButton } from '../../../../../components/shared/BackButton';

// import { PrivateComponent } from 'components/common/PrivateComponent';
// import { Permissions } from 'constants/permissions';

export const CreateRegistration = () => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    '3f026d44-6b43-47ce-ba4b-4d0a8b174286',
  );
  const {
    register,
    handleSubmit,
    control,
    watch,
    clearErrors,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [identity, setIdentity] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [isLoadingIdentity, setIsLoadingIdentity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [, setErrMessage] = useState('');
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const queryClient = useQueryClient();

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity },
  );

  const { mutate } = useMutation(registerPatient(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      if (data) {
        await queryClient.invalidateQueries(['patients-registered', selectedInstitution]);
        setRegisteredUser(data);
        setErrMessage('');
        setFoundUser(null);
        setIdentity('');
        clearErrors();
        toast({
          title: 'Success',
          description: `Pasien berhasil didaftarkan`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        reset();
        // history.push("/staff");
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

  const onSubmit = async (value) => {
    const {
      name,
      address,
      birth_date,
      birth_place,
      district,
      email,
      gender,
      identity_number,
      marital_status,
      nationality,
      phone_number,
      profession,
      province,
      city,
      religion,
      // subDistrict,
    } = value;

    const data = {
      institution_id: selectedInstitution,
      patient: {
        registered: foundUser?.id ? 1 : 0,
        ourself: 1,
        user_id: foundUser?.id ? foundUser?.id : null,
        name,
        birth_date: new Date(birth_date).toISOString().split('T')[0],
        birth_place,
        religion,
        gender,
        profession,
        marital_status,
        nationality,
        identity_number,
        responsible_person: false,
        responsible_status: null,
        phone_number,
        email,
        no_family_card: null,
        no_bpjs: null,
        image_identity: null,
        coordinate: null,
        country: 'Indonesia',
        province,
        regency: city,
        district,
        address,
        postal_code: null,
      },
    };

    await mutate(data);
  };

  const fetchUserByIdentity = async () => {
    if (identity) {
      setFoundUser(null);
      setIsLoadingIdentity(true);
      const res = await getUsersByIdentity(cookies, identity);
      setIsLoadingIdentity(false);
      if (res?.data?.email) {
        setFoundUser(res.data);
        toast({
          title: 'Success',
          description: `User found`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: `User not found`,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  React.useEffect(() => {
    setTimeout(() => {
      setValue(
        'birth_date',
        foundUser?.usersId[0]?.birth_date && new Date(foundUser.usersId[0].birth_date),
      );
      setValue('gender', foundUser?.usersId[0]?.gender);
      setValue('province', foundUser?.usersId[0]?.province);
      setValue('city', foundUser?.usersId[0]?.regency);
      setValue('district', foundUser?.usersId[0]?.district);
    }, 1000);
  }, [foundUser?.usersId, setValue]);

  const provinceWatch = watch('province', foundUser?.usersId[0]?.province);
  const cityWatch = watch('city', foundUser?.usersId[0]?.regency);
  const districtWatch = watch('district', foundUser?.usersId[0]?.district);

  return (
    <Box>
      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', '2xl': 'repeat(3, 1fr)' }}
        gap="6"
        rounded="md">
        <GridItem colSpan={2} px={{ base: 3, lg: 0 }}>
          <BackButton to="/events/registration" text="Back to Registered Patient List" />
          <Heading mb="6" fontSize="3xl">
            Register New Patient
          </Heading>
          <FormControl id="name" mb="4" maxW="xs">
            <FormLabel>Institution</FormLabel>
            <Select
              name="institution"
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}>
              <option value="">Select Institution</option>
              {isSuccessInstitution &&
                resInstitution?.data?.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
            </Select>
          </FormControl>
          {selectedInstitution && (
            <>
              <Box mb="6" maxW="md" boxShadow="md" py="4" px="6" rounded="md" bg="white">
                <FormControl id="identity">
                  <FormLabel>Identity (Email, Phone Number)</FormLabel>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      placeholder="Identity"
                      value={identity}
                      onChange={(e) => setIdentity(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        mr="2"
                        h="1.75rem"
                        size="sm"
                        onClick={fetchUserByIdentity}
                        isLoading={isLoadingIdentity}>
                        Search
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText>
                    Isi ini jika pasien sudah daftar di aplikasi Smart RS
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box pb="10">
                <Box>
                  <Box>
                    <Box as="form">
                      <Box
                        rounded={{ md: 'lg' }}
                        bg="white"
                        shadow="md"
                        overflow="hidden"
                        mb="8">
                        <Flex
                          align="center"
                          justify="space-between"
                          px="6"
                          py="4"
                          bgColor="gray.200">
                          <Text as="h3" fontWeight="bold" fontSize="lg">
                            Personal
                          </Text>
                        </Flex>
                        <Divider />
                        <Box>
                          <SimpleGrid
                            columns={{ base: 1, md: 2 }}
                            columnGap={6}
                            rowGap={6}
                            px="6"
                            pt="4"
                            pb="8">
                            <FormControl
                              id="email"
                              isInvalid={errors.email ? true : false}>
                              <FormLabel>Email</FormLabel>
                              <Input
                                type="text"
                                defaultValue={foundUser?.email}
                                {...register('email', { required: 'Email is required' })}
                              />
                              <FormErrorMessage>
                                {errors.email && errors.email.message}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl
                              id="phone_number"
                              isInvalid={errors.phone_number ? true : false}>
                              <FormLabel>Nomor HP</FormLabel>
                              <Input
                                type="text"
                                defaultValue={foundUser?.phone_number}
                                {...register('phone_number', {
                                  required: 'Phone number is required',
                                })}
                              />
                              <FormErrorMessage>
                                {errors.phone_number && errors.phone_number.message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl id="name" isInvalid={errors.name ? true : false}>
                              <FormLabel>Nama Lengkap</FormLabel>
                              <Input
                                type="text"
                                defaultValue={foundUser?.name}
                                {...register('name', { required: 'Name is required' })}
                              />
                              <FormErrorMessage>
                                {errors.name && errors.name.message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl
                              id="birth_date"
                              isInvalid={errors.birth_date ? true : false}>
                              <FormLabel>Tanggal Lahir</FormLabel>
                              <InputDate
                                name="birth_date"
                                control={control}
                                rules={{ required: 'Date of birth is required' }}
                                errors={errors}
                              />
                              <FormErrorMessage>
                                {errors.birth_date && errors.birth_date.message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl
                              id="birth_place"
                              isInvalid={errors.birth_place ? true : false}>
                              <FormLabel>Tempat Lahir</FormLabel>
                              <Input
                                type="text"
                                defaultValue={foundUser?.usersId[0]?.birth_place}
                                {...register('birth_place', {
                                  required: 'Place of birth is required',
                                })}
                              />
                              <FormErrorMessage>
                                {errors.birth_place && errors.birth_place.message}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl
                              id="religion"
                              isInvalid={errors.religion ? true : false}>
                              <FormLabel>Agama</FormLabel>
                              <Select
                                placeholder="Pilih Agama"
                                defaultValue={foundUser?.usersId[0]?.religion}
                                {...register('religion', {
                                  required: 'Religion is required',
                                })}>
                                {religionData.map((religion) => (
                                  <option value={religion.value} key={religion.value}>
                                    {religion.text}
                                  </option>
                                ))}
                              </Select>
                              <FormErrorMessage>
                                {errors.religion && errors.religion.message}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl
                              id="gender"
                              isInvalid={errors.gender ? true : false}>
                              <FormLabel>Jenis Kelamin</FormLabel>
                              <Select
                                placeholder="Pilih jenis kelamin"
                                defaultValue={foundUser?.usersId[0]?.gender}
                                {...register('gender', {
                                  required: 'Gender is required',
                                })}>
                                {genderData.map((gender) => (
                                  <option value={gender.value} key={gender.value}>
                                    {gender.text}
                                  </option>
                                ))}
                              </Select>
                              <FormErrorMessage>
                                {errors.gender && errors.gender.message}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl
                              id="profession"
                              isInvalid={errors.profession ? true : false}>
                              <FormLabel>Profesi/ Pekerjaan</FormLabel>
                              <Input
                                type="text"
                                {...register('profession', {
                                  required: 'Profession is required',
                                })}
                              />
                              <FormErrorMessage>
                                {errors.profession && errors.profession.message}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl
                              id="marital_status"
                              isInvalid={errors.profession ? true : false}>
                              <FormLabel>Status Perkawinan</FormLabel>
                              <Select
                                placeholder="Pilih status perkawinan"
                                defaultValue={foundUser?.usersId[0]?.marital_status}
                                {...register('marital_status', {
                                  required: 'Marital status is required',
                                })}>
                                {maritalStatusData.map((status) => (
                                  <option value={status.value} key={status.value}>
                                    {status.text}
                                  </option>
                                ))}
                              </Select>
                              <FormErrorMessage>
                                {errors.marital_status && errors.marital_status.message}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl
                              id="nationality"
                              isInvalid={errors.nationality ? true : false}>
                              <FormLabel>Kewarganegaraan</FormLabel>
                              <Select
                                placeholder="Pilih kewarganegaraan"
                                defaultValue={
                                  foundUser?.usersId[0]?.country || 'Indonesia'
                                }
                                {...register('nationality', {
                                  required: 'Nationality is required',
                                })}>
                                {nationData.map((nationality) => (
                                  <option
                                    value={nationality.text}
                                    key={nationality.value}>
                                    {nationality.text}
                                  </option>
                                ))}
                              </Select>
                              <FormErrorMessage>
                                {errors.nationality && errors.nationality.message}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl
                              id="identity_number"
                              isInvalid={errors.identity_number ? true : false}>
                              <FormLabel>NIK</FormLabel>
                              <Input
                                type="text"
                                defaultValue={foundUser?.usersId[0]?.identity_number}
                                {...register('identity_number', {
                                  required: 'Identity number is required',
                                })}
                              />
                              <FormErrorMessage>
                                {errors.identity_number && errors.identity_number.message}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl id="passport-no">
                              <FormLabel>Nomor Passport</FormLabel>
                              <Input
                                type="text"
                                defaultValue={foundUser?.usersId[0]?.passport_number}
                                {...register('passport_number')}
                              />
                            </FormControl>
                            <FormControl id="ktp">
                              <FormLabel>Upload KTP</FormLabel>
                              <Input
                                type="file"
                                p="0"
                                py="0.5"
                                {...register('ktp')}></Input>
                            </FormControl>
                          </SimpleGrid>
                        </Box>
                      </Box>
                      <Box
                        rounded={{ md: 'lg' }}
                        bg="white"
                        shadow="md"
                        overflow="hidden"
                        mb="8">
                        <Flex
                          align="center"
                          justify="space-between"
                          px="6"
                          py="4"
                          bgColor="gray.200">
                          <Text as="h3" fontWeight="bold" fontSize="lg">
                            Address
                          </Text>
                        </Flex>
                        <Divider />
                        <Box>
                          <SimpleGrid
                            columns={{ base: 1, md: 2 }}
                            columnGap={6}
                            rowGap={6}
                            px="6"
                            pt="4"
                            pb="8">
                            <FormControl id="province" mb="2">
                              <FormLabel>Provinsi</FormLabel>
                              <SelectProvince
                                defaultValue={foundUser?.usersId[0]?.province}
                                {...register('province')}
                              />
                            </FormControl>

                            <FormControl id="city" mb="2">
                              <FormLabel>Kota/ Kabupaten</FormLabel>
                              <SelectCity
                                province={provinceWatch}
                                defaultValue={foundUser?.usersId[0]?.regency}
                                setValue={setValue}
                                {...register('city')}
                              />
                            </FormControl>
                            <FormControl id="district" mb="2">
                              <FormLabel>Kecamatan</FormLabel>
                              <SelectDistrict
                                province={provinceWatch}
                                city={cityWatch}
                                defaultValue={foundUser?.usersId[0]?.district}
                                setValue={setValue}
                                {...register('district')}
                              />
                            </FormControl>
                            <FormControl id="sub_district" mb="2">
                              <FormLabel>Kelurahan/ Desa</FormLabel>
                              <SelectSubDistrict
                                province={provinceWatch}
                                city={cityWatch}
                                district={districtWatch}
                                defaultValue={foundUser?.usersId[0]?.sub_district}
                                setValue={setValue}
                                {...register('sub_district')}
                              />
                            </FormControl>
                            <FormControl id="address" w="full">
                              <FormLabel>Alamat</FormLabel>
                              <Input
                                type="text"
                                defaultValue={foundUser?.usersId[0]?.address}
                                {...register('address')}
                              />
                            </FormControl>
                            <FormControl id="postal_code" w="full">
                              <FormLabel>Kode Pos</FormLabel>
                              <Input
                                type="text"
                                defaultValue={foundUser?.usersId[0]?.postal_code}
                                {...register('postal_code')}
                              />
                            </FormControl>
                          </SimpleGrid>
                        </Box>
                      </Box>
                      <Box textAlign="right" mb="10">
                        {/* <PrivateComponent permission={Permissions.createRegistration}> */}
                        <Button
                          isLoading={isLoading}
                          type="submit"
                          colorScheme="purple"
                          onClick={handleSubmit(onSubmit)}>
                          Create
                        </Button>
                        {/* </PrivateComponent> */}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </GridItem>

        {/* Results */}
        {registeredUser && (
          <GridItem colSpan={{ base: 2, '2xl': 1 }}>
            <Flex justify="space-between" align="center" mb="4">
              <Heading fontSize="2xl">Result</Heading>
            </Flex>
            <Box ref={printRef} bg="white" boxShadow="md" maxW="md" p="4">
              <Box bg="gray.100" py="3">
                <Logo mb="0" />
              </Box>
              <Divider />
              <Grid templateColumns="repeat(3, 1fr)" py="4" px="2">
                <GridItem colSpan={2}>
                  <Description title="Reg ID" value={registeredUser?.data?.id} />
                  <Description title="Name" value={registeredUser?.data?.name} />
                </GridItem>
                <GridItem>
                  <QRCode value={registeredUser?.data?.qr} />
                </GridItem>
              </Grid>
            </Box>
            <Box textAlign="right" maxW="md" mt="3">
              <Button onClick={handlePrint} leftIcon={<FaPrint />}>
                Cetak
              </Button>
            </Box>
          </GridItem>
        )}
      </Grid>
    </Box>
  );
};

const Description = ({ title, value }) => {
  return (
    <Flex
      as="dl"
      // direction={{ base: "column", sm: "row" }}
      direction="column"
      // px="6"
      py="1"
      _even={{ bgColor: 'gray.50' }}>
      <Box as="dt" flexBasis="25%" fontWeight="semibold" color="gray.500">
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold" fontSize="xl">
        {value}
      </Box>
    </Flex>
  );
};
