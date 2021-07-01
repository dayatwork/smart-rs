import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  SimpleGrid,
  UnorderedList,
  ListItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  ModalFooter,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Center,
  Spinner,
  useToast,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';

import { getAllergiesByGroup } from '../../../../../../api/master-data-services/allergies';
import {
  getPatientAllergies,
  updatePatientAllergies,
} from '../../../../../../api/medical-record-services/allergies';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../access-control';

export const Allergies = ({ patientDetail }) => {
  const [cookies] = useCookies(['token']);
  const allergiesGridColumns = useBreakpointValue({ base: 1, md: 2, xl: 3 });
  const {
    isOpen: isOpenAllergiesModal,
    onOpen: onOpenAllergiesModal,
    onClose: onCloseAllergiesModal,
  } = useDisclosure();

  const {
    data: dataPatientAllergies,
    isLoading: isLoadingPatientAllergies,
    isSuccess: isSuccessPatientAllergies,
  } = useQuery(
    ['patient-allergies', patientDetail?.patient?.user_id],
    () => getPatientAllergies(cookies, patientDetail?.patient?.user_id),
    { enabled: Boolean(patientDetail?.patient?.user_id), staleTime: Infinity }
  );

  return (
    <>
      <UpdateAllergiesModal
        isOpen={isOpenAllergiesModal}
        onClose={onCloseAllergiesModal}
        patientDetail={patientDetail}
      />
      <Box p="4">
        <Flex
          justify="space-between"
          mb="2"
          align={{ base: 'stretch', md: 'center' }}
          flexDir={{ base: 'column', md: 'row' }}
        >
          <Heading
            as="h3"
            fontSize="xl"
            color="purple.500"
            mb={{ base: '2', md: '0' }}
          >
            Allergies
          </Heading>
          <PrivateComponent permission={Permissions.updatePatientAllergy}>
            <Button
              onClick={onOpenAllergiesModal}
              colorScheme="green"
              size="sm"
            >
              Update Allergies
            </Button>
          </PrivateComponent>
        </Flex>
        {isLoadingPatientAllergies && (
          <Center py="6">
            <Spinner />
          </Center>
        )}
        {isSuccessPatientAllergies && (
          <SimpleGrid columns={allergiesGridColumns} px="3" gap="4">
            <Box p="2">
              {dataPatientAllergies?.data?.Drugs && (
                <Heading as="h4" fontSize="md" fontWeight="medium" mb="1.5">
                  Drug
                </Heading>
              )}
              <UnorderedList>
                {dataPatientAllergies?.data?.Drugs?.map(drug => (
                  <ListItem key={drug.id}>{drug.name}</ListItem>
                ))}
              </UnorderedList>
            </Box>
            <Box p="2">
              {dataPatientAllergies?.data?.Food && (
                <Heading as="h4" fontSize="md" fontWeight="medium" mb="1.5">
                  Food
                </Heading>
              )}

              <UnorderedList>
                {dataPatientAllergies?.data?.Food?.map(food => (
                  <ListItem key={food.id}>{food.name}</ListItem>
                ))}
              </UnorderedList>
            </Box>
            <Box p="2">
              {dataPatientAllergies?.data?.Others && (
                <Heading as="h4" fontSize="md" fontWeight="medium" mb="1.5">
                  Others
                </Heading>
              )}

              <UnorderedList>
                {dataPatientAllergies?.data?.Others?.map(allergy => (
                  <ListItem key={allergy.id}>{allergy.name}</ListItem>
                ))}
              </UnorderedList>
            </Box>
          </SimpleGrid>
        )}
        {isSuccessPatientAllergies && dataPatientAllergies?.code === 404 && (
          <Center py="6">
            <Text>No Allergies</Text>
          </Center>
        )}
      </Box>
    </>
  );
};

const UpdateAllergiesModal = ({ isOpen, onClose, patientDetail }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { data: res } = useQuery('allergies-group', () =>
    getAllergiesByGroup(cookies)
  );

  const { data: dataPatientAllergies } = useQuery(
    ['patient-allergies', patientDetail?.patient?.user_id],
    () => getPatientAllergies(cookies, patientDetail?.patient?.user_id),
    { enabled: Boolean(patientDetail?.patient?.user_id), staleTime: Infinity }
  );

  const onSubmit = async value => {
    const allergies = [
      ...value.foodAllergies,
      ...value.drugAllergies,
      ...value.othersAllergies,
    ];

    const formatted = allergies
      .filter(allergy => allergy !== false)
      .map(allergy => JSON.parse(allergy));

    const data = {
      user_id: patientDetail?.patient?.user_id,
      patient_id: patientDetail?.patient_id,
      data: formatted,
    };

    try {
      setIsLoadingSubmit(true);
      await updatePatientAllergies(cookies, data);
      await queryClient.invalidateQueries([
        'patient-allergies',
        patientDetail?.patient?.user_id,
      ]);
      setIsLoadingSubmit(false);
      reset({});
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Alergi berhasil di update`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      setIsLoadingSubmit(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Alergi gagal di update`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Allergies</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs isFitted colorScheme="purple">
            <TabList>
              <Tab>Drugs</Tab>
              <Tab>Food</Tab>
              <Tab>Others</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box>
                  <Heading fontSize="md" mb="2">
                    Drugs
                  </Heading>
                  <SimpleGrid columns={2} gap="3">
                    {res?.data.Drugs.map((allergy, index) => {
                      const isCheck = dataPatientAllergies?.data?.Drugs?.find(
                        drug => drug.id === allergy.id
                      );
                      return (
                        <Checkbox
                          key={allergy.id}
                          colorScheme="red"
                          value={JSON.stringify({
                            allergy_id: allergy.id,
                            allergy_name: allergy.name,
                          })}
                          defaultChecked={!!isCheck}
                          {...register(`drugAllergies[${index}]`)}
                        >
                          {allergy.name}
                        </Checkbox>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  <Heading fontSize="md" mb="2">
                    Food
                  </Heading>
                  <SimpleGrid columns={2} gap="3">
                    {res?.data.Food.map((allergy, index) => {
                      const isCheck = dataPatientAllergies?.data?.Food?.find(
                        food => food.id === allergy.id
                      );
                      return (
                        <Checkbox
                          key={allergy.id}
                          colorScheme="red"
                          value={JSON.stringify({
                            allergy_id: allergy.id,
                            allergy_name: allergy.name,
                          })}
                          defaultChecked={!!isCheck}
                          {...register(`foodAllergies[${index}]`)}
                        >
                          {allergy.name}
                        </Checkbox>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={1} gap="3">
                  {res?.data.Others.map((allergy, index) => {
                    const isCheck = dataPatientAllergies?.data?.Others?.find(
                      other => other.id === allergy.id
                    );
                    return (
                      <Checkbox
                        key={allergy.id}
                        colorScheme="red"
                        value={JSON.stringify({
                          allergy_id: allergy.id,
                          allergy_name: allergy.name,
                        })}
                        defaultChecked={!!isCheck}
                        {...register(`othersAllergies[${index}]`)}
                      >
                        {allergy.name}
                      </Checkbox>
                    );
                  })}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            isLoading={isLoadingSubmit}
            colorScheme="green"
            onClick={handleSubmit(onSubmit)}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
