import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Center,
  Spinner,
  Text,
  Stack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';

import { getSocialHistories } from '../../../../../../api/master-data-services/social-histories';
import {
  getPatientSocialHistories,
  updatePatientSocialHistories,
} from '../../../../../../api/medical-record-services/social-history';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../access-control';

export const SocialHistory = ({ patientDetail, userDetails }) => {
  const [cookies] = useCookies(['token']);

  const {
    isOpen: isOpenSocialHistoryModal,
    onOpen: onOpenSocialHistoryModal,
    onClose: onCloseSocialHistoryModal,
  } = useDisclosure();

  const {
    data: resSocialHistories,
    isSuccess: isSuccessSocialHistories,
    isLoading: isLoadingSocialHistories,
  } = useQuery(
    ['patient-social-history', patientDetail?.patient_id],
    () => getPatientSocialHistories(cookies, patientDetail?.patient_id),
    { enabled: Boolean(patientDetail?.patient_id), staleTime: Infinity }
  );

  return (
    <>
      <UpdateSocialHistoryModal
        isOpen={isOpenSocialHistoryModal}
        onClose={onCloseSocialHistoryModal}
        patientDetail={patientDetail}
        userDetails={userDetails}
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
            Social History
          </Heading>
          <PrivateComponent permission={Permissions.updatePatientSocialHistory}>
            <Button
              onClick={onOpenSocialHistoryModal}
              colorScheme="green"
              size="sm"
            >
              Update Social History
            </Button>
          </PrivateComponent>
        </Flex>
        {isLoadingSocialHistories && (
          <Center py="6">
            <Spinner />
          </Center>
        )}
        {isSuccessSocialHistories && (
          <Box px="4">
            {resSocialHistories?.data.map(socialHistory => (
              <Description
                key={socialHistory.id}
                title={socialHistory.social_history_name}
                value={socialHistory.value}
              />
            ))}
          </Box>
        )}
        {isSuccessSocialHistories && resSocialHistories?.code === 404 && (
          <Center py="6">
            <Text>No social history</Text>
          </Center>
        )}
      </Box>
    </>
  );
};

const UpdateSocialHistoryModal = ({
  isOpen,
  onClose,
  patientDetail,
  userDetails,
}) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm();

  const { data: res } = useQuery(
    'master-social-histories',
    () => getSocialHistories(cookies),
    { staleTime: Infinity }
  );

  const {
    data: dataPatientSocialHistories,
    // isFetching,
  } = useQuery(
    ['patient-social-history', patientDetail?.patient_id],
    () => getPatientSocialHistories(cookies, patientDetail?.patient_id),
    { enabled: Boolean(patientDetail?.patient_id), staleTime: Infinity }
  );

  const queryClient = useQueryClient();

  const onSubmit = async value => {
    const { social_history } = value;
    const formatted = social_history
      .filter(soc_history => soc_history !== false)
      .map(soc_history => JSON.parse(soc_history));

    const data = {
      user_id: patientDetail?.patient?.user_id,
      patient_id: patientDetail?.patient_id,
      data: formatted,
    };

    try {
      await updatePatientSocialHistories(cookies, data);
      await queryClient.invalidateQueries([
        'patient-social-history',
        patientDetail?.patient_id,
      ]);
      reset({});
      toast({
        title: 'Success',
        description: `Social history berhasil di update`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Social history gagal di update`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      onClose();
    }
  };

  const age = calculateAge(userDetails?.usersId[0]?.birth_date);
  const gender = userDetails?.usersId[0]?.gender;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Social History</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <VStack align="stretch" spacing="8">
              {res?.data.map((socialHistory, index) => {
                const found = dataPatientSocialHistories?.data?.find(
                  socHistory =>
                    socHistory.social_history_id === socialHistory.id
                );

                if (socialHistory.name === 'Water intake') {
                  return (
                    <FormControl key={socialHistory.id} id={socialHistory.id}>
                      <FormLabel>{socialHistory.name}</FormLabel>
                      <RadioGroup
                        // ref={register}
                        name={`social_history[${index}]`}
                        defaultValue={JSON.stringify({
                          social_history_id: found?.social_history_id,
                          social_history_name: found?.social_history_name,
                          value: found?.value,
                        })}
                      >
                        <Stack>
                          {age >= 9 && age <= 13 && gender === 'male' && (
                            <>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'More than 10 cups or 2.4 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                More than 10 cups or 2.4 L/day
                              </Radio>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'Less than 10 cups or 2.4 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                Less than 10 cups or 2.4 L/day
                              </Radio>
                            </>
                          )}
                          {age >= 9 && age <= 13 && gender === 'female' && (
                            <>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'More than 9 cups or 2.1 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                More than 9 cups or 2.1 L/day
                              </Radio>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'Less than 9 cups or 2.1 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                Less than 9 cups or 2.1 L/day
                              </Radio>
                            </>
                          )}
                          {age >= 14 && age <= 18 && gender === 'male' && (
                            <>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'More than 13 cups or 3.3 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                More than 13 cups or 3.3 L/day
                              </Radio>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'Less than 13 cups or 3.3 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                Less than 13 cups or 3.3 L/day
                              </Radio>
                            </>
                          )}
                          {age >= 14 && age <= 18 && gender === 'female' && (
                            <>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'More than 10 cups or 2.3 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                More than 10 cups or 2.3 L/day
                              </Radio>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'Less than 10 cups or 2.3 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                Less than 10 cups or 2.3 L/day
                              </Radio>
                            </>
                          )}
                          {age >= 19 && gender === 'male' && (
                            <>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'More than 15 cups or 3.7 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                More than 15 cups or 3.7 L/day
                              </Radio>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'Less than 15 cups or 3.7 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                Less than 15 cups or 3.7 L/day
                              </Radio>
                            </>
                          )}
                          {age >= 19 && gender === 'female' && (
                            <>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'More than 11 cups or 2.7 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                More than 11 cups or 2.7 L/day
                              </Radio>
                              <Radio
                                size="md"
                                colorScheme="green"
                                value={JSON.stringify({
                                  social_history_id: socialHistory.id,
                                  social_history_name: socialHistory.name,
                                  value: 'Less than 11 cups or 2.7 L/day',
                                })}
                                {...register(`social_history[${index}]`)}
                              >
                                Less than 11 cups or 2.7 L/day
                              </Radio>
                            </>
                          )}
                          {!age && <Text>Patient age not found</Text>}
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  );
                }

                return (
                  <FormControl key={socialHistory.id} id={socialHistory.id}>
                    <FormLabel>{socialHistory.name}</FormLabel>
                    <Select
                      defaultValue={JSON.stringify({
                        social_history_id: found?.social_history_id,
                        social_history_name: found?.social_history_name,
                        value: found?.value,
                      })}
                      {...register(`social_history[${index}]`)}
                    >
                      <option>Select {socialHistory.name}</option>
                      {socialHistory?.default_value?.map(value => (
                        <option
                          key={value}
                          value={JSON.stringify({
                            social_history_id: socialHistory.id,
                            social_history_name: socialHistory.name,
                            value: value,
                          })}
                        >
                          {value}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                );
              })}
            </VStack>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            isLoading={isSubmitting}
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

const calculateAge = birthDate => {
  if (!birthDate) return null;
  return new Date().getFullYear() - new Date(birthDate).getFullYear();
};

const Description = ({ title, value, ...props }) => {
  return (
    <Flex
      as="dl"
      direction={{ base: 'column', sm: 'row' }}
      // px="6"
      py="1"
      _even={{ bgColor: 'gray.50' }}
      {...props}
    >
      <Box as="dt" flexBasis="35%" fontWeight="semibold" color="gray.600">
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {Array.isArray(value) ? value.join(', ') : value}
      </Box>
    </Flex>
  );
};
