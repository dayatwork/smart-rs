/* eslint-disable react/no-children-prop */
import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  FormControl,
  FormLabel,
  InputGroup,
  Flex,
  InputRightAddon,
  Button,
  Select,
  useToast,
  Input,
  Text,
  FormHelperText,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';

import BloodType from '../../../../../../data/bloodType.json';
import {
  getPatientVitalSign,
  createPatientVitalSign,
} from '../../../../../../api/medical-record-services/vital-sign';
import {
  PrivateComponent,
  Permissions,
} from '../../../../../../access-control';

import {
  calculateBMI,
  getBmiStatus,
  getBloodPressureStatus,
  getBodyTemperatureStatus,
  getOxygenSaturationStatus,
  getPulseRateStatus,
  getRespiratoryRateStatus,
} from './vital-sign-helper';

export const VitalSign = ({ patientDetail, userDetail }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const [bmi, setBmi] = useState(0);
  const [bmiStatus, setBmiStatus] = useState('');
  const [temp, setTemp] = useState(0);
  const [tempStatus, setTempStatus] = useState('');
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [oxygenSaturation, setOxygenSaturation] = useState(0);
  const [oxygenSaturationStatus, setOxygenSaturationStatus] = useState('');
  const [bloodPressureNum, setBloodPressureNum] = useState(0);
  const [bloodPressureDen, setBloodPressureDen] = useState(0);
  const [bloodPressureStatus, setBloodPressureStatus] = useState('');
  const [pulseRate, setPulseRate] = useState(0);
  const [pulseRateStatus, setPulseRateStatus] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState(0);
  const [respiratoryRateStatus, setRespiratoryRateStatus] = useState('');
  const [age, setAge] = useState(null);
  const { register, handleSubmit, setValue } = useForm();
  const queryClient = useQueryClient();
  const vitalSignGridColumns = useBreakpointValue({
    base: 1,
    md: 2,
    lg: 3,
    xl: 4,
  });

  const { data: dataPatientVitalSign } = useQuery(
    ['vital-sign', patientDetail?.patient?.user_id],
    () => getPatientVitalSign(cookies, patientDetail?.patient?.user_id),
    { enabled: Boolean(patientDetail?.patient?.user_id) }
  );

  useEffect(() => {
    setTimeout(() => {
      setValue('blood_type', dataPatientVitalSign?.data?.blood_type);
      setValue(
        'waist_circumference',
        Number(dataPatientVitalSign?.data?.waist_circumference || '0')
      );
      setValue(
        'head_circumference',
        Number(dataPatientVitalSign?.data?.head_circumference || '0')
      );
      setOxygenSaturation(
        Number(dataPatientVitalSign?.data?.oxygen_saturation || '0')
      );
      setBloodPressureNum(
        Number(dataPatientVitalSign?.data?.blood_pressure_numerator || '0')
      );
      setBloodPressureDen(
        Number(dataPatientVitalSign?.data?.blood_pressure_denominator || '0')
      );
      setPulseRate(Number(dataPatientVitalSign?.data?.pulse_rate || '0'));
      setRespiratoryRate(
        Number(dataPatientVitalSign?.data?.respiratory_rate || '0')
      );
      setHeight(Number(dataPatientVitalSign?.data?.height || '0'));
      setWeight(Number(dataPatientVitalSign?.data?.weight || '0'));
      setTemp(Number(dataPatientVitalSign?.data?.temperature || '0'));
    }, 1000);
  }, [dataPatientVitalSign?.data, setValue]);

  const onSubmit = async value => {
    const { blood_type, waist_circumference, head_circumference } = value;

    const data = {
      user_id: patientDetail?.patient?.user_id,
      patient_id: patientDetail?.patient_id,
      height: Number(height),
      weight: Number(weight),
      bmi: Number(bmi),
      bmi_status: bmiStatus,
      blood_type,
      pulse_rate: Number(pulseRate),
      blood_pressure_numerator: Number(bloodPressureNum),
      blood_pressure_denominator: Number(bloodPressureDen),
      respiratory_rate: Number(respiratoryRate),
      temperature: Number(temp),
      waist_circumference: Number(waist_circumference),
      head_circumference: Number(head_circumference),
      oxygen_saturation: Number(oxygenSaturation),
    };

    try {
      setIsLoading(true);
      await createPatientVitalSign(cookies, data);
      await queryClient.invalidateQueries([
        'vital-sign',
        patientDetail?.patient?.user_id,
      ]);
      setIsLoading(false);
      toast({
        title: 'Success',
        description: `Vital sign updated`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: `Error update vital sign`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const bmi = calculateBMI(weight, height);
    setBmi(bmi);
  }, [height, weight]);

  useEffect(() => {
    const status = getBmiStatus(bmi);
    const patientTempStatus = getBodyTemperatureStatus(Number(temp || 0));
    const patientOxyStatus = getOxygenSaturationStatus(
      Number(oxygenSaturation || 0)
    );
    const patientBloodPressureStatus = getBloodPressureStatus(
      Number(bloodPressureNum || 0),
      Number(bloodPressureDen || 0)
    );
    const patientPulseRateStatus = age
      ? getPulseRateStatus(Number(pulseRate || 0), Number(age))
      : 'Patient age not found';
    const patientRespiratoryRateStatus = age
      ? getRespiratoryRateStatus(Number(respiratoryRate || 0), Number(age))
      : 'Patient age not found';
    setBmiStatus(status);
    setTempStatus(patientTempStatus);
    setOxygenSaturationStatus(patientOxyStatus);
    setBloodPressureStatus(patientBloodPressureStatus);
    setPulseRateStatus(patientPulseRateStatus);
    setRespiratoryRateStatus(patientRespiratoryRateStatus);
  }, [
    bmi,
    temp,
    oxygenSaturation,
    bloodPressureNum,
    bloodPressureDen,
    age,
    pulseRate,
    respiratoryRate,
  ]);

  useEffect(() => {
    setAge(
      new Date().getFullYear() -
        new Date(userDetail?.usersId[0]?.birth_date).getFullYear()
    );
  }, [userDetail?.usersId]);

  return (
    <Box
      border="1px"
      borderColor="gray.200"
      p="4"
      rounded="md"
      boxShadow="sm"
      mt="2"
      mb="6"
    >
      {dataPatientVitalSign?.data && (
        <SimpleGrid columns={vitalSignGridColumns} rowGap="6" columnGap="4">
          <FormControl maxW="60" id="name">
            <FormLabel>Blood Type</FormLabel>
            <Select size="sm" {...register('blood_type')}>
              <option value="">Pilih Golongan Darah</option>
              {BloodType.map(type => (
                <option key={type.value} value={type.value}>
                  {type.text}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl maxW="60" id="blood_pressure">
            <FormLabel color="gray.700">Blood Pressure</FormLabel>
            <InputGroup size="sm">
              <Flex alignItems="center">
                <Input
                  size="sm"
                  name="blood_pressure_numerator"
                  type="number"
                  value={bloodPressureNum}
                  onChange={e => setBloodPressureNum(e.target.value)}
                  borderColor={`${
                    bloodPressureStatus === 'Normal' ||
                    bloodPressureStatus === 'Ideal'
                      ? 'green.200'
                      : bloodPressureStatus === 'Pre-Hypertension'
                      ? 'yellow.200'
                      : bloodPressureStatus === 'Hypertension - Stage 1'
                      ? 'orange.200'
                      : bloodPressureStatus === 'Hypertension - Stage 2'
                      ? 'orange.300'
                      : bloodPressureStatus === 'Hypertension - Stage 3' ||
                        bloodPressureStatus === 'Hypertension - Stage 4'
                      ? 'red.200'
                      : bloodPressureStatus === 'Low'
                      ? 'teal.100'
                      : bloodPressureStatus === 'Moderate Hypotension'
                      ? 'blue.300'
                      : 'blue.200'
                  }`}
                />
                <Box as="span" fontWeight="bold" mx="2">
                  /
                </Box>
                <Input
                  size="sm"
                  name="blood_pressure_denominator"
                  type="number"
                  value={bloodPressureDen}
                  onChange={e => setBloodPressureDen(e.target.value)}
                  borderColor={`${
                    bloodPressureStatus === 'Normal' ||
                    bloodPressureStatus === 'Ideal'
                      ? 'green.200'
                      : bloodPressureStatus === 'Pre-Hypertension'
                      ? 'yellow.200'
                      : bloodPressureStatus === 'Hypertension - Stage 1'
                      ? 'orange.200'
                      : bloodPressureStatus === 'Hypertension - Stage 2'
                      ? 'orange.300'
                      : bloodPressureStatus === 'Hypertension - Stage 3' ||
                        bloodPressureStatus === 'Hypertension - Stage 4'
                      ? 'red.200'
                      : bloodPressureStatus === 'Low'
                      ? 'teal.100'
                      : bloodPressureStatus === 'Moderate Hypotension'
                      ? 'blue.300'
                      : 'blue.200'
                  }`}
                />
                <InputRightAddon children="mmHg" />
              </Flex>
            </InputGroup>
            <FormHelperText
              fontWeight={
                bloodPressureStatus === 'Ideal' ||
                bloodPressureStatus === 'Hypertension - Stage 4' ||
                bloodPressureStatus === 'Extremely Severe Hypotension'
                  ? 'semibold'
                  : 'normal'
              }
              color={`${
                bloodPressureStatus === 'Normal' ||
                bloodPressureStatus === 'Ideal'
                  ? 'green.500'
                  : bloodPressureStatus === 'Pre-Hypertension'
                  ? 'yellow.500'
                  : bloodPressureStatus === 'Hypertension - Stage 1'
                  ? 'orange.500'
                  : bloodPressureStatus === 'Hypertension - Stage 2'
                  ? 'orange.700'
                  : bloodPressureStatus === 'Hypertension - Stage 3' ||
                    bloodPressureStatus === 'Hypertension - Stage 4'
                  ? 'red.500'
                  : bloodPressureStatus === 'Low'
                  ? 'teal.300'
                  : bloodPressureStatus === 'Moderate Hypotension'
                  ? 'blue.300'
                  : 'blue.500'
              }`}
            >
              {bloodPressureStatus}
            </FormHelperText>
          </FormControl>
          <FormControl maxW="60" id="pulse_rate">
            <FormLabel color="gray.700">Pulse Rate</FormLabel>
            <InputGroup size="sm">
              <Input
                type="number"
                name="pulse_rate"
                value={pulseRate}
                onChange={e => setPulseRate(e.target.value)}
                borderColor={`${
                  age
                    ? pulseRateStatus === 'Normal'
                      ? 'green.200'
                      : 'yellow.200'
                    : null
                }`}
              />
              <InputRightAddon children="X/mnt" />
            </InputGroup>
            <FormHelperText
              color={`${
                age
                  ? pulseRateStatus === 'Normal'
                    ? 'green.500'
                    : 'yellow.500'
                  : null
              }`}
            >
              {pulseRateStatus}
            </FormHelperText>
          </FormControl>
          <FormControl maxW="60" id="respiratory_rate">
            <FormLabel color="gray.700">Respiratory Rate</FormLabel>
            <InputGroup size="sm">
              <Input
                type="number"
                name="respiratory_rate"
                value={respiratoryRate}
                onChange={e => setRespiratoryRate(e.target.value)}
                borderColor={`${
                  age
                    ? respiratoryRateStatus === 'Normal'
                      ? 'green.200'
                      : respiratoryRateStatus === 'Abnormal'
                      ? 'yellow.200'
                      : 'red.200'
                    : null
                }`}
              />
              <InputRightAddon children="X/mnt" />
            </InputGroup>
            <FormHelperText
              color={`${
                age
                  ? respiratoryRateStatus === 'Normal'
                    ? 'green.500'
                    : respiratoryRateStatus === 'Abnormal'
                    ? 'yellow.500'
                    : 'red.500'
                  : null
              }`}
            >
              {respiratoryRateStatus}
            </FormHelperText>
          </FormControl>
          <FormControl maxW="60" id="oxygen_saturation">
            <FormLabel color="gray.700">SpO2</FormLabel>
            <InputGroup size="sm">
              <Input
                type="number"
                name="oxygen_saturation"
                value={oxygenSaturation}
                onChange={e => setOxygenSaturation(e.target.value)}
                borderColor={`${
                  oxygenSaturationStatus === 'Normal'
                    ? 'green.200'
                    : oxygenSaturationStatus === 'Invalid input'
                    ? 'red.200'
                    : oxygenSaturationStatus === 'Hypoxic - Stage 1'
                    ? 'orange.200'
                    : 'red.200'
                }`}
              />
              <InputRightAddon children="%" />
            </InputGroup>
            <FormHelperText
              fontWeight={
                oxygenSaturationStatus === 'Hypoxic - Stage 3'
                  ? 'semibold'
                  : 'normal'
              }
              color={`${
                oxygenSaturationStatus === 'Normal'
                  ? 'green.500'
                  : oxygenSaturationStatus === 'Invalid input'
                  ? 'red.500'
                  : oxygenSaturationStatus === 'Hypoxic - Stage 1'
                  ? 'orange.500'
                  : 'red.500'
              }`}
            >
              {oxygenSaturationStatus}
            </FormHelperText>
          </FormControl>
          <FormControl maxW="60" id="temperature">
            <FormLabel color="gray.700">Temperature</FormLabel>
            <InputGroup size="sm">
              <Input
                type="number"
                name="temperature"
                value={temp}
                onChange={e => setTemp(e.target.value)}
                borderColor={`${
                  tempStatus === 'Normal'
                    ? 'green.200'
                    : tempStatus === 'Hypothermia'
                    ? 'blue.200'
                    : tempStatus === 'Fever/ Hyperthermia'
                    ? 'orange.200'
                    : 'red.200'
                }`}
              />
              <InputRightAddon children={`\u00b0 C`} />
            </InputGroup>
            <FormHelperText
              color={`${
                tempStatus === 'Normal'
                  ? 'green.500'
                  : tempStatus === 'Hypothermia'
                  ? 'blue.500'
                  : tempStatus === 'Fever/ Hyperthermia'
                  ? 'orange.500'
                  : 'red.500'
              }`}
            >
              {tempStatus}
            </FormHelperText>
          </FormControl>
          <FormControl maxW="60" id="weight">
            <FormLabel color="gray.700">Weight</FormLabel>
            <InputGroup size="sm">
              <Input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
              />
              <InputRightAddon children="kg" />
            </InputGroup>
          </FormControl>
          <FormControl maxW="60" id="height">
            <FormLabel color="gray.700">Heigth</FormLabel>
            <InputGroup size="sm">
              <Input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
              />
              <InputRightAddon children="cm" />
            </InputGroup>
          </FormControl>
          <FormControl maxW="60" id="bmi">
            <FormLabel color="gray.700">BMI</FormLabel>
            <Text
              py="1"
              fontSize="sm"
              px="3"
              border="1px"
              borderColor={`${
                bmiStatus === 'Normal'
                  ? 'green.200'
                  : bmiStatus === 'Underweight' || bmiStatus === 'Overweight'
                  ? 'yellow.600'
                  : bmiStatus === 'Obesity'
                  ? 'red.200'
                  : 'gray.200'
              }`}
            >
              {bmi}
            </Text>
            <FormHelperText
              color={`${
                bmiStatus === 'Normal'
                  ? 'green.500'
                  : bmiStatus === 'Underweight' || bmiStatus === 'Overweight'
                  ? 'yellow.600'
                  : bmiStatus === 'Obesity'
                  ? 'red.500'
                  : 'gray.500'
              }`}
            >
              {bmiStatus}
            </FormHelperText>
          </FormControl>
          {/* <FormControl maxW="60" id="bmi_status">
            <FormLabel>BMI Status</FormLabel>
            {bmiStatus && (
              <Text
                py="1"
                fontSize="sm"
                px="3"
                border="1px"
                borderColor={`${
                  bmiStatus === "Normal"
                    ? "green.200"
                    : bmiStatus === "Underweight" || bmiStatus === "Overweight"
                    ? "yellow.300"
                    : bmiStatus === "Obesity"
                    ? "red.200"
                    : "gray.200"
                }`}
              >
                {bmiStatus}
              </Text>
            )}
          </FormControl> */}
          <FormControl maxW="60" id="head_circumference">
            <FormLabel color="gray.700">Head Circumference</FormLabel>
            <InputGroup size="sm">
              <Input type="number" {...register('head_circumference')} />
              <InputRightAddon children="cm" />
            </InputGroup>
          </FormControl>
          <FormControl maxW="60" id="waist_circumference">
            <FormLabel color="gray.700">Waist Circumference</FormLabel>
            <InputGroup size="sm">
              <Input type="number" {...register('waist_circumference')} />
              <InputRightAddon children="cm" />
            </InputGroup>
          </FormControl>
        </SimpleGrid>
      )}
      <PrivateComponent permission={Permissions.updatePatientVitalSign}>
        <Flex justify="flex-end">
          <Button
            size="sm"
            mt="2"
            w="24"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}
          >
            Save
          </Button>
        </Flex>
      </PrivateComponent>
    </Box>
  );
};
