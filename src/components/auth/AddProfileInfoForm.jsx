import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  SimpleGrid,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';

import {
  InputDate,
  InputIdentityNumber,
  SelectCity,
  SelectDistrict,
  SelectGender,
  SelectProvince,
  SelectSubDistrict,
} from '../../components/shared/input';
import { getUserProfile } from '../../api/user-services/user-management';

export const AddProfileInfoForm = ({ onSubmit, isLoading }) => {
  const [cookies, setCookie] = useCookies(['token']);
  const [defaultValues, setDefaultValues] = useState({
    name: '',
    phone_number: '',
    identity_number: '',
    gender: '',
    address: '',
  });
  const [userDetails, setUserDetails] = useState(null);
  const { register, handleSubmit, reset, setValue, watch, control } = useForm({
    defaultValues,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data } = await getUserProfile(cookies?.token);

      const details = {
        id: data?.id,
        email: data?.email,
        name: data?.name,
        institution_id: data?.institution_id,
        phone_number: data?.phone_number,
        role: data?.role,
        role_id: data?.role_id,
        user_type: data?.user_type,
        gender: data?.usersId[0]?.gender,
        identity_number: data?.usersId[0]?.identity_number,
        birth_date: data?.usersId[0]?.birth_date,
        province: data?.usersId[0]?.province,
        regency: data?.usersId[0]?.regency,
        district: data?.usersId[0]?.district,
        address: data?.usersId[0]?.address,
      };

      setUserDetails(details);

      setCookie('user', JSON.stringify(details), { path: '/' });
    };
    fetchUserDetails();
  }, [cookies?.token, setCookie]);

  useEffect(() => {
    if (userDetails) {
      setDefaultValues({
        name: userDetails.name,
        phone_number: userDetails.phone_number,
        gender: userDetails.gender,
        identity_number: userDetails.identity_number,
        birth_date: new Date(userDetails.birth_date),
        address: userDetails.address,
        province: userDetails.province,
        city: userDetails.regency,
        district: userDetails.district,
      });

      reset({
        name: userDetails.name,
        phone_number: userDetails.phone_number,
        gender: userDetails.gender,
        identity_number: userDetails.identity_number,
        birth_date: new Date(userDetails.birth_date),
        address: userDetails.address,
        province: userDetails.province,
        city: userDetails.regency,
        district: userDetails.district,
      });
    }
  }, [reset, userDetails]);

  const provinceWatch = watch('province', userDetails?.province);
  const cityWatch = watch('city', userDetails?.regency);
  const districtWatch = watch('district', userDetails?.district);

  return (
    <>
      <Box>
        <Stack spacing="2">
          <FormControl id="name">
            <FormLabel>Nama Lengkap</FormLabel>
            <Input {...register('name')} />
          </FormControl>
          <FormControl id="phone_number">
            <FormLabel>Nomor HP</FormLabel>
            <Input type="number" {...register('phone_number')} />
          </FormControl>
          <FormControl id="identity_number">
            <FormLabel>NIK</FormLabel>
            <InputIdentityNumber
              setValue={setValue}
              {...register('identity_number', { maxLength: 16 })}
            />
          </FormControl>
          <SimpleGrid columns={2} gap="4">
            <FormControl id="birth_date">
              <FormLabel>Tanggal Lahir</FormLabel>
              <InputDate name="birth_date" control={control} />
            </FormControl>
            <FormControl id="gender">
              <FormLabel>Jenis Kelamin</FormLabel>
              <SelectGender {...register('gender')} />
            </FormControl>
          </SimpleGrid>
          <FormControl id="address">
            <FormLabel>Alamat</FormLabel>
            <Input {...register('address')} />
          </FormControl>
          <SimpleGrid columns={2} gap="4">
            <FormControl id="province" mb="2">
              <FormLabel>Provinsi</FormLabel>
              <SelectProvince
                defaultValue={userDetails?.province}
                {...register('province')}
              />
            </FormControl>
            <FormControl id="city" mb="2">
              <FormLabel>Kota/ Kabupaten</FormLabel>
              <SelectCity
                province={provinceWatch}
                defaultValue={userDetails?.regency}
                setValue={setValue}
                // ref={register}
                {...register('city')}
              />
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={2} gap="4">
            <FormControl id="district" mb="2">
              <FormLabel>Kecamatan</FormLabel>
              <SelectDistrict
                province={provinceWatch}
                city={cityWatch}
                defaultValue={userDetails?.district}
                setValue={setValue}
                // ref={register}
                {...register('district')}
              />
            </FormControl>
            <FormControl id="sub_district" mb="2">
              <FormLabel>Kelurahan/ Desa</FormLabel>
              <SelectSubDistrict
                province={provinceWatch}
                city={cityWatch}
                district={districtWatch}
                defaultValue={userDetails?.sub_district}
                setValue={setValue}
                {...register('sub_district')}
              />
            </FormControl>
          </SimpleGrid>
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            fontSize="md"
            data-testid="submit-button"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}>
            Simpan dan Lanjutkan
          </Button>
        </Stack>
      </Box>
      <Box mt="4" align="center" maxW="md" fontWeight="medium">
        <Link to="/add-health-info">
          <Box
            as="span"
            marginStart="1"
            color="blue.600"
            _hover={{ color: 'blue.600' }}
            display={{ base: 'block', sm: 'revert' }}
            data-testid="skip-link">
            Skip
          </Box>
        </Link>
      </Box>
    </>
  );
};
