import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';

import {
  getICD10ById,
  searchICD10,
} from '../../../../../../api/master-data-services/icd10';
import {
  getPatientAssessment,
  createPatientAssessment,
} from '../../../../../../api/medical-record-services/soap';

export const Assesment = ({ patientDetail, soapAssessments }) => {
  const toast = useToast();
  const [cookies] = useCookies(['token']);
  const [selectedICD, setSelectedICD] = useState([]);
  const [searchBy, setSearchBy] = useState('code');
  const { register, handleSubmit, reset } = useForm();
  const [currentICD, setCurrentICD] = useState([]);
  const [isLoadingCreateAssessment, setIsLoadingCreateAssessment] = useState(false);

  useEffect(() => {
    const getAssessment = async () => {
      const res = await getPatientAssessment(cookies, soapAssessments[0].id);
      const icdId = res?.data?.soap_assessment_details?.map((icd) => icd.icd_id);
      setCurrentICD(icdId);
      reset({ doctor_note: res?.data?.doctor_note });
    };
    if (soapAssessments[0].id) {
      getAssessment();
    }
  }, [cookies, soapAssessments, reset]);

  const fetchICDDetail = useCallback(
    async (id) => {
      const res = await getICD10ById(cookies, id);
      return {
        id: res?.data?.id,
        code: res?.data?.code,
        name: res?.data?.name,
        name_id: res?.data?.name_id,
      };
    },
    [cookies],
  );

  useEffect(() => {
    currentICD.forEach(async (id) => {
      const icd = await fetchICDDetail(id);
      setSelectedICD((prev) => {
        const newIcd = {
          label: `${icd.code} - ${icd.name}`,
          value: JSON.stringify({
            id: icd.id,
            code: icd.code,
            name: icd.name,
            name_id: icd.name_id,
          }),
        };
        const already = prev.find((i) => i.label === newIcd.label);
        if (already) {
          return prev;
        }
        return [...prev, newIcd];
      });
    });
  }, [currentICD, fetchICDDetail]);

  const handleChange = (selectedICD) => {
    setSelectedICD(selectedICD || []);
  };

  const debounceFetch = debounce((inputText, callback, searchBy) => {
    if (inputText === '') {
      return callback(null, { options: [] });
    }
    searchICD10(cookies, { searchBy, inputText }).then((json) => {
      const icd10 = json?.data?.map((item) => ({
        label: `${item.code} - ${item.name}`,
        value: JSON.stringify({
          id: item.id,
          code: item.code,
          name: item.name,
          name_id: item.name_id,
        }),
      }));

      callback(icd10);
    });
  }, 250);

  const loadOptions = (inputText, callback) => {
    debounceFetch(inputText, callback, searchBy);
  };

  const onSubmit = async (value) => {
    const { doctor_note } = value;
    const soap_assessment_id = soapAssessments[0].id;
    const user_id = patientDetail?.patient?.user_id;
    const patient_id = patientDetail?.patient_id;
    const data = selectedICD.map((icd) => ({
      icd_id: JSON.parse(icd.value).id,
      icd_name: JSON.parse(icd.value).name,
    }));

    const payload = {
      soap_assessment_id,
      user_id,
      patient_id,
      doctor_note,
      data,
    };

    try {
      setIsLoadingCreateAssessment(true);
      await createPatientAssessment(cookies, payload);
      setIsLoadingCreateAssessment(false);
      toast({
        title: 'Success',
        description: `Assessment added successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoadingCreateAssessment(false);
      toast({
        title: 'Error',
        description: `Error add assessment`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="white" p="4" boxShadow="md">
      <Box px="4" maxW="2xl">
        <FormControl id="icd10" mb="4">
          <Flex justify="space-between" align="center" mb="2">
            <FormLabel m="0">ICD 10</FormLabel>
            <Select value={searchBy} onChange={(e) => setSearchBy(e.target.value)} w="40">
              <option value="">Search by</option>
              <option value="code">Code</option>
              <option value="name">Name</option>
              <option value="name_id">Name (ID)</option>
            </Select>
          </Flex>
          <AsyncSelect
            isMulti
            // cacheOptions
            isClearable
            value={selectedICD}
            onChange={handleChange}
            loadOptions={loadOptions}
            // components={AnimatedComponent}
          />
        </FormControl>
        <FormControl id="notes" mb="4">
          <FormLabel>{`Doctor's notes`}</FormLabel>
          <Textarea rows="8" {...register('doctor_note')} />
        </FormControl>
        <Button onClick={handleSubmit(onSubmit)} isLoading={isLoadingCreateAssessment}>
          Save
        </Button>
      </Box>
    </Box>
  );
};
