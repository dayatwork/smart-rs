import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Avatar,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  UnorderedList,
  ListItem,
  Center,
  Spinner,
  Skeleton,
  useBreakpointValue,
} from '@chakra-ui/react';
import QRCode from 'qrcode.react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getHospitalPatientById } from '../../../../../api/patient-services/hospital-patient';
import { getUsersByIdentity } from '../../../../../api/user-services/user-management';
import { getPatientVitalSign } from '../../../../../api/medical-record-services/vital-sign';
import { getPatientMedicalHistories } from '../../../../../api/medical-record-services/medical-history';
import { getPatientFamilyHistories } from '../../../../../api/medical-record-services/family-history';
import { getPatientSocialHistories } from '../../../../../api/medical-record-services/social-history';
import { getPatientAllergies } from '../../../../../api/medical-record-services/allergies';

export const PatientProfile = ({ dataSoap }) => {
  const [cookies] = useCookies(['token']);
  const avatarSize = useBreakpointValue({ base: 'lg', md: 'xl' });

  const { data: dataPatientDetail, isLoading: isLoadingPatientDetail } =
    useQuery(
      ['hospital-patients', dataSoap.institution_id, dataSoap.patient_id],
      () =>
        getHospitalPatientById(cookies, {
          institution_id: dataSoap.institution_id,
          patient_id: dataSoap.patient_id,
        }),
      {
        enabled:
          Boolean(dataSoap.institution_id) && Boolean(dataSoap.patient_id),
      }
    );

  const { data: dataUserDetails, isLoading: isLoadingUserDetails } = useQuery(
    ['user-details', dataPatientDetail?.data?.patient?.email],
    () => getUsersByIdentity(cookies, dataPatientDetail?.data?.patient?.email),
    { enabled: Boolean(dataPatientDetail?.data?.patient?.email) }
  );

  return (
    <Box>
      <Flex
        p={{ base: '6', lg: '10' }}
        // align={{ base: 'baseline', md: 'center' }}
        align="center"
        justify="space-between"
        bg="white"
        boxShadow="md"
        direction={{ base: 'column', md: 'row' }}
        mb="8"
      >
        <Flex align="center" px="4" mb={{ base: '4', lg: '0' }}>
          <Avatar
            size={avatarSize}
            // size="xl"
            name="Segun Adebayo"
            src="https://bit.ly/broken-link"
            mr={{ base: '4', lg: '10' }}
          />
          <Box>
            {isLoadingPatientDetail ? (
              <Skeleton height="20px" w="lg" mb="2" />
            ) : (
              <Text fontSize="2xl" fontWeight="bold">
                {dataPatientDetail?.data?.patient?.name}
              </Text>
            )}
            {isLoadingPatientDetail ? (
              <Skeleton height="20px" w="lg" />
            ) : (
              <Text fontWeight="semibold" color="gray.600">
                Patient ID: {dataPatientDetail?.data?.patient_id}
              </Text>
            )}
          </Box>
        </Flex>
        <Box>
          <QRCode value="http://google.com" />
        </Box>
      </Flex>
      <Box bg="white" boxShadow="md" py="6">
        <Tabs isFitted size="lg" colorScheme="purple">
          <TabList>
            <Tab fontWeight="semibold">Contact Information</Tab>
            <Tab fontWeight="semibold">Health Information</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Profile
                isLoadingPatientDetail={isLoadingPatientDetail}
                patient={dataPatientDetail?.data?.patient}
              />
            </TabPanel>
            <TabPanel>
              {isLoadingPatientDetail || isLoadingUserDetails ? (
                <Center h="40">
                  <Spinner
                    thickness="4px"
                    emptyColor="gray.200"
                    color="purple.500"
                    size="lg"
                  />
                </Center>
              ) : (
                <HealthInfo
                  patientDetail={dataPatientDetail?.data}
                  userDetail={dataUserDetails?.data}
                />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

const Profile = ({ patient, isLoadingPatientDetail }) => (
  <Box px={{ base: '2', md: '6' }}>
    <Description
      title="Name"
      value={
        isLoadingPatientDetail ? (
          <Skeleton height="20px" w="xs" />
        ) : (
          patient?.name
        )
      }
    />
    <Description
      title="Email"
      value={
        isLoadingPatientDetail ? (
          <Skeleton height="20px" w="xs" />
        ) : (
          patient?.email
        )
      }
    />
    <Description
      title="Patient Type"
      value={
        isLoadingPatientDetail ? (
          <Skeleton height="20px" w="xs" />
        ) : (
          patient?.type
        )
      }
    />
    <Description
      title="Nationality"
      value={
        isLoadingPatientDetail ? (
          <Skeleton height="20px" w="xs" />
        ) : (
          patient?.nationality
        )
      }
    />
    <Description
      title="Phone Number"
      value={
        isLoadingPatientDetail ? (
          <Skeleton height="20px" w="xs" />
        ) : (
          patient?.phone_number
        )
      }
    />
    <Description
      title="Address"
      value={
        isLoadingPatientDetail ? (
          <Skeleton height="20px" w="xs" />
        ) : (
          patient?.address || '-'
        )
      }
    />
  </Box>
);

const HealthInfo = ({ patientDetail, userDetail }) => {
  const [cookies] = useCookies(['token']);
  const healthInfoGridColumns = useBreakpointValue({ base: 1, lg: 2 });

  const { data: dataPatientVitalSign, isLoading: isLoadingPatientVitalSign } =
    useQuery(
      ['vital-sign', patientDetail?.patient_id],
      () => getPatientVitalSign(cookies, patientDetail?.patient_id),
      { enabled: Boolean(patientDetail?.patient_id) }
    );

  const { data: resMedHistories, isLoading: isLoadingMedHistory } = useQuery(
    ['patient-medical-history', patientDetail?.patient_id],
    () => getPatientMedicalHistories(cookies, patientDetail?.patient_id)
  );

  const { data: resFamHistories, isLoading: isLoadingFamHistory } = useQuery(
    ['patient-family-history', patientDetail?.patient_id],
    () => getPatientFamilyHistories(cookies, patientDetail?.patient_id)
  );

  const { data: resSocialHistories, isLoading: isLoadingSocialHistory } =
    useQuery(['patient-social-history', patientDetail?.patient_id], () =>
      getPatientSocialHistories(cookies, patientDetail?.patient_id)
    );

  const { data: dataPatientAllergies, isLoading: isLoadingPatientAllergies } =
    useQuery(
      ['patient-allergies', patientDetail?.patient_id],
      () => getPatientAllergies(cookies, patientDetail?.patient_id),
      { enabled: Boolean(patientDetail?.patient_id) }
    );

  if (
    isLoadingPatientVitalSign ||
    isLoadingPatientAllergies ||
    isLoadingFamHistory ||
    isLoadingMedHistory ||
    isLoadingSocialHistory
  ) {
    return (
      <Center h="40">
        <Spinner
          thickness="4px"
          emptyColor="gray.200"
          color="purple.500"
          size="md"
        />
      </Center>
    );
  }

  return (
    <SimpleGrid columns={healthInfoGridColumns}>
      <Box px={{ base: '2', md: '6' }}>
        <Description
          title="Sex"
          value={
            userDetail?.usersId[0]?.gender
              ? userDetail?.usersId[0]?.gender
              : '-'
          }
        />
        <Description
          title="Date of Birth"
          value={
            userDetail?.usersId[0]?.birth_date
              ? new Date(userDetail?.usersId[0]?.birth_date).toLocaleDateString(
                  'id-ID',
                  {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }
                )
              : '-'
          }
        />
        <Description
          title="Age"
          value={
            userDetail?.usersId[0]?.birth_date
              ? `${
                  new Date().getFullYear() -
                  new Date(userDetail?.usersId[0]?.birth_date).getFullYear()
                } tahun`
              : '-'
          }
        />
        <Description
          title="Height"
          value={
            dataPatientVitalSign?.data?.height
              ? `${dataPatientVitalSign?.data?.height} cm`
              : ''
          }
        />
        <Description
          title="Weight"
          value={
            dataPatientVitalSign?.data?.weight
              ? `${dataPatientVitalSign?.data?.weight} kg`
              : ''
          }
        />
        <Description
          title="Blood Type"
          value={
            dataPatientVitalSign?.data?.blood_type
              ? `${dataPatientVitalSign?.data?.blood_type}`
              : ''
          }
        />

        <Description
          title="Medical History"
          value={
            resMedHistories?.code === 404
              ? '-'
              : resMedHistories?.data
                  ?.map(medHistory => medHistory?.name)
                  .join(', ')
          }
        />
        <Description
          title="Family History"
          value={
            resFamHistories?.code === 404
              ? '-'
              : resFamHistories?.data
                  ?.map(famHistory => famHistory?.family_history_name)
                  .join(', ')
          }
        />
      </Box>
      <Box px={{ base: '2', md: '6' }}>
        <Box mb="6">
          <Heading py="4" fontSize="lg">
            Allergies
          </Heading>
          <SimpleGrid columns={3}>
            <Box border="1px" borderColor="gray.200">
              <Text p="2" textAlign="center" bg="gray.100">
                Drugs
              </Text>
              <UnorderedList px="4">
                {dataPatientAllergies?.data?.Drugs?.map(drug => (
                  <ListItem key={drug.id} py="2">
                    {drug.name}
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
            <Box border="1px" borderColor="gray.200">
              <Text p="2" textAlign="center" bg="gray.100">
                Food
              </Text>
              <UnorderedList px="4">
                {dataPatientAllergies?.data?.Food?.map(food => (
                  <ListItem key={food.id} py="2">
                    {food.name}
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
            <Box border="1px" borderColor="gray.200">
              <Text p="2" textAlign="center" bg="gray.100">
                Others
              </Text>
              <UnorderedList px="4">
                {dataPatientAllergies?.data?.Others?.map(allergy => (
                  <ListItem key={allergy.id} py="2">
                    {allergy.name}
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
          </SimpleGrid>
        </Box>
        <Box>
          <Heading py="4" fontSize="lg">
            Social History
          </Heading>
          {resSocialHistories?.data?.map(history => (
            <Description
              key={history?.id}
              py="2"
              title={history?.social_history_name}
              value={history?.value}
            />
          ))}
        </Box>
      </Box>
    </SimpleGrid>
  );
};

const Description = ({ title, value, ...props }) => {
  return (
    <Flex
      as="dl"
      direction={{ base: 'column', sm: 'row' }}
      // px="6"
      py={{ base: '2', md: '4' }}
      // _even="gray.50"
      {...props}
    >
      <Box
        as="dt"
        flexBasis="25%"
        fontWeight="semibold"
        color="gray.600"
        mr="4"
      >
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
