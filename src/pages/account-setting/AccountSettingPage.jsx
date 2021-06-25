import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  StackDivider,
  Text,
  useColorModeValue,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { HiCloudUpload } from 'react-icons/hi';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';

import { WebPatientNav } from '../../components/web-patient/shared/WebPatientNav';
import { FieldGroup } from './FieldGroup';
import { UpdateVitalSign } from './UpdateVitalSign';
import {
  getUserProfile,
  updateUserDetail,
} from '../../api/user-services/user-management';
import {
  SelectProvince,
  SelectCity,
  SelectDistrict,
  SelectSubDistrict,
  InputDate,
} from '../../components/shared/input';

export const AccountSettingPage = () => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [defaultValues, setDefaultValues] = useState({
    address: '',
    province: '',
    city: '',
    district: '',
    subdistrict: '',
  });
  const { register, handleSubmit, reset, control } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    watch: watch2,
    setValue: setValue2,
  } = useForm({ defaultValues });
  const [userDetails, setUserDetails] = useState(null);
  const [isLoadingPersonalInfo, setIsLoadingPersonalInfo] = useState(false);
  const [isLoadingAddressInfo, setIsLoadingAddressInfo] = useState(false);

  const { data: res } = useQuery(
    ['user-profile', cookies.token],
    () => getUserProfile(cookies.token),
    { enabled: Boolean(cookies.token) }
  );

  useEffect(() => {
    reset({
      name: res?.data?.name,
      email: res?.data?.email,
      phone_number: res?.data?.phone_number,
      identity_number: res?.data?.usersId[0]?.identity_number,
      birth_date: new Date(res?.data?.usersId[0]?.birth_date),
    });
  }, [reset, res?.data]);

  useEffect(() => {
    setUserDetails({
      province: res?.data?.usersId[0]?.province,
      regency: res?.data?.usersId[0]?.regency,
      district: res?.data?.usersId[0]?.district,
      address: res?.data?.usersId[0]?.address,
    });
  }, [res?.data?.usersId]);

  useEffect(() => {
    if (userDetails) {
      setDefaultValues({
        address: userDetails.address,
        province: userDetails.province,
        city: userDetails.regency,
        district: userDetails.district,
      });
      reset2({
        address: userDetails.address,
        province: userDetails.province,
        city: userDetails.regency,
        district: userDetails.district,
      });
    }
  }, [reset2, userDetails]);

  const provinceWatch = watch2('province', userDetails?.province);
  const cityWatch = watch2('city', userDetails?.regency);
  const districtWatch = watch2('district', userDetails?.district);

  const onSubmit = async values => {
    const { name, phone_number, identity_number, birth_date } = values;

    const data = {
      name,
      phone_number,
      identity_number,
      birth_date,
    };

    try {
      setIsLoadingPersonalInfo(true);
      await updateUserDetail(cookies)(data);
      // await queryClient.invalidateQueries(['user-profile', cookies.token]);
      setIsLoadingPersonalInfo(false);
      toast({
        title: 'Success',
        description: 'Personal berhasil di update',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoadingPersonalInfo(false);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onSubmit2 = async values => {
    const { address, province, city, district, subdistrict } = values;

    const data = {
      address,
      province,
      regency: city,
      district,
      subdistrict,
    };

    try {
      setIsLoadingAddressInfo(true);
      await updateUserDetail(cookies)(data);
      // await queryClient.invalidateQueries(['user-profile', cookies.token]);
      setIsLoadingAddressInfo(false);
      toast({
        title: 'Success',
        description: 'Alamat berhasil di update',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoadingAddressInfo(false);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // console.log({ res });

  return (
    <>
      <WebPatientNav />
      <Box px={{ base: '4', md: '10' }} py="10" maxWidth="3xl" mx="auto">
        <Box id="settings-form">
          <Stack spacing="4" divider={<StackDivider />}>
            <Heading size="lg" as="h1" paddingBottom="4">
              Account Settings
            </Heading>
            <FieldGroup title="Personal Info">
              <VStack width="full" spacing="6">
                <FormControl id="name">
                  <FormLabel>Name</FormLabel>
                  <Input {...register('name')} />
                </FormControl>

                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input type="email" readOnly {...register('email')} />
                </FormControl>

                <FormControl id="identity_number">
                  <FormLabel>NIK</FormLabel>
                  <Input type="number" {...register('identity_number')} />
                </FormControl>

                <FormControl id="birth_date">
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <InputDate name="birth_date" control={control} />
                </FormControl>

                <FormControl id="phone_number">
                  <FormLabel>Phone</FormLabel>
                  <Input type="number" {...register('phone_number')} />
                </FormControl>

                <Button
                  alignSelf="end"
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isLoadingPersonalInfo}
                >
                  Save Changes
                </Button>
              </VStack>
            </FieldGroup>
            <FieldGroup title="Profile Photo">
              <Stack direction="row" spacing="6" align="center" width="full">
                <Avatar
                  size="xl"
                  name="Tim Cook"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                />
                <Box>
                  <HStack spacing="5">
                    <Button leftIcon={<HiCloudUpload />}>Change photo</Button>
                    <Button variant="ghost" colorScheme="red">
                      Delete
                    </Button>
                  </HStack>
                  <Text
                    fontSize="sm"
                    mt="3"
                    color={useColorModeValue('gray.500', 'whiteAlpha.600')}
                  >
                    .jpg or .png. Max file size 700K.
                  </Text>
                </Box>
              </Stack>
            </FieldGroup>

            <FieldGroup title="Address">
              <VStack width="full" spacing="6">
                <FormControl id="address">
                  <FormLabel>Street</FormLabel>
                  <Input {...register2('address')} />
                </FormControl>

                <FormControl id="province">
                  <FormLabel>Provinsi</FormLabel>
                  <SelectProvince
                    defaultValue={userDetails?.province}
                    {...register2('province')}
                  />
                </FormControl>

                <FormControl id="city">
                  <FormLabel>Kabupaten/ Kota</FormLabel>
                  <SelectCity
                    province={provinceWatch}
                    defaultValue={userDetails?.regency}
                    setValue={setValue2}
                    // ref={register}
                    {...register2('city')}
                  />
                </FormControl>

                <FormControl id="district">
                  <FormLabel>Kecamatan</FormLabel>
                  <SelectDistrict
                    province={provinceWatch}
                    city={cityWatch}
                    defaultValue={userDetails?.district}
                    setValue={setValue2}
                    // ref={register}
                    {...register2('district')}
                  />
                </FormControl>

                <FormControl id="subdistrict">
                  <FormLabel>Kelurahan/ Desa</FormLabel>
                  <SelectSubDistrict
                    province={provinceWatch}
                    city={cityWatch}
                    district={districtWatch}
                    defaultValue={userDetails?.sub_district}
                    setValue={setValue2}
                    {...register2('sub_district')}
                  />
                </FormControl>

                <Button
                  alignSelf="end"
                  onClick={handleSubmit2(onSubmit2)}
                  isLoading={isLoadingAddressInfo}
                >
                  Save Changes
                </Button>
              </VStack>
            </FieldGroup>

            <FieldGroup title="Password">
              <VStack width="full" spacing="6">
                <FormControl id="current_password">
                  <FormLabel>Current Password</FormLabel>
                  <Input type="password" maxLength={255} />
                </FormControl>

                <FormControl id="new_password">
                  <FormLabel>New Password</FormLabel>
                  <Input type="password" />
                </FormControl>

                <Button alignSelf="end">Change Password</Button>
              </VStack>
            </FieldGroup>

            <FieldGroup title="Health Info">
              <UpdateVitalSign />
            </FieldGroup>
          </Stack>
        </Box>
      </Box>
    </>
  );
};
