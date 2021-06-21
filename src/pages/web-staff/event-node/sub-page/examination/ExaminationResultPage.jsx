import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import {
  getSoapById,
  getPatientObjective,
  getPatientAssessment,
  getPatientPrescription,
} from '../../../../../api/medical-record-services/soap';
import { getHospitalPatientById } from '../../../../../api/patient-services/hospital-patient';
import { getPatientSymptoms } from '../../../../../api/medical-record-services/symptom';
import { BackButton } from '../../../../../components/shared/BackButton';

export const ExaminationResultPage = () => {
  const params = useParams();
  const [cookies] = useCookies(['token']);

  const { data: dataSoap, isLoading: isLoadingSoap } = useQuery(
    ['patient-soap', params.soapId],
    () => getSoapById(cookies, params.soapId),
    { enabled: Boolean(params.soapId) },
  );

  const { data: dataPatient, isLoading: isLoadingPatient } = useQuery(
    ['hospital-patients', dataSoap?.data?.institution_id, dataSoap?.data?.patient_id],
    () =>
      getHospitalPatientById(cookies, {
        institution_id: dataSoap?.data?.institution_id,
        patient_id: dataSoap?.data?.patient_id,
      }),
    {
      enabled:
        Boolean(cookies) &&
        Boolean(dataSoap?.data?.institution_id) &&
        Boolean(dataSoap?.data?.patient_id),
    },
  );

  const { data: dataPatientSymptoms, isLoading: isLoadingPatientSymptoms } = useQuery(
    [
      'patient-symptoms',
      dataSoap?.data?.patient_id,
      dataSoap?.data?.soap_subjectives[0]?.id,
    ],
    () =>
      getPatientSymptoms(
        cookies,
        dataSoap?.data?.patient_id,
        dataSoap?.data?.soap_subjectives[0]?.id,
      ),
    {
      enabled:
        Boolean(cookies) &&
        Boolean(dataSoap?.data?.patient_id) &&
        Boolean(dataSoap?.data?.soap_subjectives[0]?.id),
    },
  );

  const { data: dataPatientObjectives, isLoading: isLoadingPatientObjectives } = useQuery(
    ['patient-objective', dataSoap?.data?.id],
    () => getPatientObjective(cookies, dataSoap?.data?.id),
    { enabled: Boolean(cookies) && Boolean(dataSoap?.data?.id) },
  );

  const { data: dataPatientAssessments, isLoading: isLoadingPatientAssessments } =
    useQuery(
      ['patient-assessment'],
      () => getPatientAssessment(cookies, dataSoap?.data?.soap_assessments[0]?.id),
      {
        enabled: Boolean(cookies) && Boolean(dataSoap?.data?.soap_assessments[0]?.id),
      },
    );

  const { data: dataPatientPrescriptions, isLoading: isLoadingPatientPrescriptions } =
    useQuery(
      ['prescription', dataSoap?.data?.institution_id, dataSoap?.data?.soap_plans[0]?.id],
      () =>
        getPatientPrescription(
          cookies,
          dataSoap?.data?.institution_id,
          dataSoap?.data?.soap_plans[0]?.id,
        ),
      {
        enabled:
          Boolean(cookies) &&
          Boolean(dataSoap?.data?.institution_id) &&
          Boolean(dataSoap?.data?.soap_plans[0]?.id),
      },
    );

  if (
    isLoadingSoap ||
    isLoadingPatient ||
    isLoadingPatientSymptoms ||
    isLoadingPatientObjectives ||
    isLoadingPatientAssessments ||
    isLoadingPatientPrescriptions
  ) {
    return (
      <Center h="60">
        <Spinner thickness="4px" emptyColor="gray.200" color="purple.500" size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <BackButton to="/events/examination/history" text="Back to History List" />
      <Heading mb="6" fontSize="3xl">
        SOAP Result
      </Heading>
      <Box mb="8">
        <Heading mb="2" fontSize="xl">
          Patient Data
        </Heading>
        <Box boxShadow="md" bgColor="white" p="4" borderRadius="md">
          <Description
            title="Name"
            value={dataPatient?.data?.patient?.name}
            // mb="2"
          />
          <Description
            title="Patient Number"
            value={dataPatient?.data?.patient_number}
            // mb="2"
          />
          <Description
            title="Patient ID"
            value={dataPatient?.data?.patient_id}
            // mb="2"
          />
          <Description
            title="Date"
            value={new Date(dataSoap?.data?.date).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
            // mb="2"
          />
          <Description
            title="Transaction Number"
            value={dataSoap?.data?.transaction_number}
            // mb="2"
          />
        </Box>
      </Box>
      <Box mb="8">
        <Heading mb="2" fontSize="xl">
          Subjective
        </Heading>
        <Box boxShadow="md" bgColor="white" p="4" borderRadius="md">
          <Heading mb="4" fontSize="md">
            Symptoms
          </Heading>
          {dataPatientSymptoms?.code === 404 && (
            <Center h="20" mb="6">
              <Text>Empty</Text>
            </Center>
          )}
          {dataPatientSymptoms?.data?.patient_symptom_details?.map((symptom, index) => (
            <Box key={symptom.id} pl="4">
              <Text mb="2" fontWeight="semibold">
                Symptom {index + 1}
              </Text>
              <Description title="Symptom Name" value={symptom?.symptom_name || '-'} />
              <Description title="Onset" value={symptom?.onset || '-'} />
              <Description title="Location" value={symptom?.location || '-'} />
              <Description title="Duration" value={symptom?.duration || '-'} />
              <Description
                title="Characterization"
                value={symptom?.characterization || '-'}
              />
              <Description
                title="Alleviating and Aggravating Factors"
                value={symptom?.alleviating_and_aggravating_factors || '-'}
              />
              <Description title="Radiation" value={symptom?.radiation || '-'} />
              <Description
                title="Temporal Factor"
                value={symptom?.temporal_factor || '-'}
              />
              <Description title="Severity" value={symptom?.severity || '-'} />
            </Box>
          ))}
        </Box>
      </Box>
      <Box mb="8">
        <Heading mb="2" fontSize="xl">
          Objective
        </Heading>
        <Box boxShadow="md" bgColor="white" p="4" borderRadius="md">
          <Heading mb="4" fontSize="md">
            Objective Result
          </Heading>
          <SimpleGrid columns={2} pl="4">
            {dataPatientObjectives?.data?.soap_objective_details?.map((objective) => (
              <Flex
                key={objective.id}
                as="dl"
                direction={{ base: 'column', sm: 'row' }}
                mb="2">
                <Box as="dt" flexBasis="35%">
                  {objective?.soap_objective_template_name}
                </Box>
                <Box as="dd" flex="1" fontWeight="semibold">
                  {objective?.description}
                </Box>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
      <Box mb="8">
        <Heading mb="2" fontSize="xl">
          Assessment
        </Heading>
        <Box boxShadow="md" bgColor="white" p="4" borderRadius="md">
          <Heading mb="4" fontSize="md">
            ICD 10
          </Heading>
          <Box pl="4" mb="4">
            <SimpleGrid columns={2} mb="2">
              <Text fontWeight="semibold" color="gray.600">
                ICD Code
              </Text>
              <Text fontWeight="semibold" color="gray.600">
                Description
              </Text>
            </SimpleGrid>
            {dataPatientAssessments?.data?.soap_assessment_details?.map((assessment) => (
              <SimpleGrid key={assessment.id} columns={2}>
                <Text>{assessment?.icd_code || '-'}</Text>
                <Text>{assessment?.icd_name}</Text>
              </SimpleGrid>
            ))}
          </Box>
          <Heading mb="4" fontSize="md" fontWeight="bold">
            {`Doctor's Note`}
          </Heading>
          <Text pl="4">{dataPatientAssessments?.data?.doctor_note}</Text>
        </Box>
      </Box>
      <Box mb="8">
        <Heading mb="2" fontSize="xl">
          Prescription
        </Heading>
        <Box boxShadow="md" bgColor="white" p="4" borderRadius="md">
          {dataPatientSymptoms?.code === 404 ? (
            <Center h="20">
              <Text>Empty</Text>
            </Center>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Drug Name</Th>
                  <Th>Quantity</Th>
                  <Th>Frequency (per day)</Th>
                  <Th>After/Before Meals</Th>
                  <Th>Description</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataPatientPrescriptions?.data?.map((prescription) => (
                  <Tr key={prescription.id}>
                    <Td>{prescription.drug_name}</Td>
                    <Td>{prescription.quantity}</Td>
                    <Td>
                      {prescription.frequency} {prescription.frequency && 'per day'}
                    </Td>
                    <Td>
                      {prescription?.eat?.toLowerCase() === 'after'
                        ? 'After meals'
                        : prescription?.eat?.toLowerCase() === 'before'
                        ? 'Before meals'
                        : 'Free'}
                    </Td>
                    <Td>{prescription.description}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const Description = ({ title, value, ...props }) => {
  return (
    <Flex as="dl" direction={{ base: 'column', sm: 'row' }} mb="2" {...props}>
      <Box as="dt" flexBasis="25%">
        {title}
      </Box>
      <Box as="dd" flex="1" fontWeight="semibold">
        {value}
      </Box>
    </Flex>
  );
};
