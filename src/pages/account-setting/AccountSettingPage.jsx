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
} from '@chakra-ui/react';
import * as React from 'react';
import { HiCloudUpload } from 'react-icons/hi';

import { WebPatientNav } from '../../components/web-patient/shared/WebPatientNav';
import { FieldGroup } from './FieldGroup';
import { UpdateVitalSign } from './UpdateVitalSign';
// import {
//   getUserProfile,
//   createUserVitalSign,
//   updateUserDetails,
// } from "query/user-management/users";
// import { getPatientVitalSign } from "query/medical-record/vital-sign";
// import { getPatientAllergies } from "query/medical-record/allergies";
// import { getAllergiesByGroup } from "query/master/allergies";

export const AccountSettingPage = () => {
  // const { register, handleSubmit, errors, setValue, reset } = useForm({
  //   defaultValues,
  // });

  // const onSubmit = (e) => {
  //   e.preventDefault();
  // };
  return (
    <>
      <WebPatientNav />
      <Box px={{ base: '4', md: '10' }} py="10" maxWidth="3xl" mx="auto">
        <form id="settings-form">
          <Stack spacing="4" divider={<StackDivider />}>
            <Heading size="lg" as="h1" paddingBottom="4">
              Account Settings
            </Heading>
            <FieldGroup title="Personal Info">
              <VStack width="full" spacing="6">
                <FormControl id="name">
                  <FormLabel>Name</FormLabel>
                  <Input type="text" maxLength={255} />
                </FormControl>

                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input type="email" isReadOnly value="joe@chakra-ui.com" />
                </FormControl>

                <FormControl id="identity_number">
                  <FormLabel>NIK</FormLabel>
                  <Input />
                </FormControl>

                <FormControl id="phone_number">
                  <FormLabel>Phone</FormLabel>
                  <Input />
                </FormControl>

                {/* <FormControl id="bio">
                  <FormLabel>Bio</FormLabel>
                  <Textarea rows={5} />
                  <FormHelperText>
                    Brief description for your profile. URLs are hyperlinked.
                  </FormHelperText>
                </FormControl> */}

                <Button alignSelf="end">Save Changes</Button>
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
            <FieldGroup title="Alamat">
              <VStack width="full" spacing="6">
                <FormControl id="street">
                  <FormLabel>Jalan</FormLabel>
                  <Input />
                </FormControl>

                <FormControl id="province">
                  <FormLabel>Provinsi</FormLabel>
                  <Input />
                </FormControl>

                <FormControl id="city">
                  <FormLabel>Kabupaten/ Kota</FormLabel>
                  <Input />
                </FormControl>

                <FormControl id="district">
                  <FormLabel>Kecamatan</FormLabel>
                  <Input />
                </FormControl>

                <FormControl id="subdistrict">
                  <FormLabel>Kelurahan/ Desa</FormLabel>
                  <Input />
                </FormControl>

                <Button alignSelf="end">Save Changes</Button>
              </VStack>
            </FieldGroup>

            <FieldGroup title="Health Info">
              <UpdateVitalSign />
            </FieldGroup>
          </Stack>
          {/* <FieldGroup mt="8">
            <HStack width="full">
              <Button type="submit" colorScheme="blue">
                Save Changes
              </Button>
              <Button variant="outline">Cancel</Button>
            </HStack>
          </FieldGroup> */}
        </form>
      </Box>
    </>
  );
};
