import React, { useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  VisuallyHidden,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import {
  getPatientObjective,
  updatePatientObjective,
} from '../../../../../../api/medical-record-services/soap';
import { VitalSign } from './VitalSign';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../access-control';

export const Objective = ({ soapId, patientDetail, userDetail }) => {
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [, setErrMessage] = useState(false);
  const { register, handleSubmit, reset, clearErrors } = useForm();
  const queryClient = useQueryClient();
  const objectiveGridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  const { data: dataPatientObjectives } = useQuery(
    ['patient-objective', soapId],
    () => getPatientObjective(cookies, soapId),
    { enabled: Boolean(soapId), staleTime: Infinity }
  );

  const { mutate } = useMutation(updatePatientObjective(cookies), {
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: async (data, error) => {
      setIsLoading(false);
      if (data) {
        await queryClient.invalidateQueries(['patient-objective', soapId]);
        setErrMessage('');
        reset();
        clearErrors();
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

  const onSubmit = async value => {
    const { objectives } = value;
    const payload = {
      data: objectives,
    };
    await mutate(payload);
  };

  return (
    <>
      <Box bg="white" p="4" boxShadow="md" overflow="auto">
        <Box px="4" mb="4">
          <PrivateComponent permission={Permissions.indexPatientVitalSign}>
            <>
              <Heading as="h3" fontSize="xl" color="purple.500" mt="2">
                Vital Sign
              </Heading>
              <VitalSign
                patientDetail={patientDetail}
                userDetail={userDetail}
              />
            </>
          </PrivateComponent>
          <PrivateComponent permission={Permissions.indexSoapObjective}>
            <>
              <Flex justify="space-between" align="center">
                <Heading as="h3" fontSize="xl" color="purple.500">
                  Objective
                </Heading>
              </Flex>
              <Box py="4">
                <Accordion allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          Results
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <SimpleGrid
                        columns={objectiveGridColumns}
                        columnGap="8"
                        rowGap="4"
                        py="4"
                      >
                        {dataPatientObjectives?.data?.soap_objective_details
                          ?.sort(compare)
                          ?.map((objective, index) => {
                            return (
                              <Flex
                                align="flex-end"
                                key={objective.id}
                                // mb="2"
                                // maxW="md"
                              >
                                <FormControl id={objective.id} display="none">
                                  <VisuallyHidden as="label">Id</VisuallyHidden>
                                  <Input
                                    defaultValue={objective.id}
                                    // disabled
                                    display="none"
                                    {...register(
                                      `objectives[${index}].soap_objective_detail_id`
                                    )}
                                  />
                                </FormControl>
                                <FormControl
                                  id={objective.soap_objective_template_name}
                                  mr="2"
                                >
                                  <FormLabel>
                                    {objective.soap_objective_template_name}
                                  </FormLabel>
                                  <Input
                                    defaultValue={objective.description}
                                    {...register(
                                      `objectives[${index}].description`
                                    )}
                                  />
                                </FormControl>
                              </Flex>
                            );
                          })}
                      </SimpleGrid>
                      <PrivateComponent
                        permission={Permissions.updateSoapObjective}
                      >
                        <Flex justify="flex-end">
                          <Button
                            onClick={handleSubmit(onSubmit)}
                            isLoading={isLoading}
                          >
                            Save
                          </Button>
                        </Flex>
                      </PrivateComponent>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </>
          </PrivateComponent>
        </Box>
      </Box>
    </>
  );
};

function compare(a, b) {
  if (a.soap_objective_template_name < b.soap_objective_template_name) {
    return -1;
  }
  if (a.soap_objective_template_name > b.soap_objective_template_name) {
    return 1;
  }
  return 0;
}
