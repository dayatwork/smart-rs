/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Spinner,
  Tooltip,
  useClipboard,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';

import { AuthContext } from '../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../api/institution-services/institution';
import { getHospitalPatients } from '../../../../../api/patient-services/hospital-patient';
import { importPatient } from '../../../../../api/patient-services/patient';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../components/shared/BackButton';
import { PrivateComponent, Permissions } from '../../../../../access-control';

export const RegisteredPatientList = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );
  const [clipboardValue, setClipboardValue] = useState('');
  const { hasCopied, onCopy } = useClipboard(clipboardValue);

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    data: res,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery(
    ['hospital-patients', selectedInstitution],
    () => getHospitalPatients(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const data = React.useMemo(
    () =>
      isSuccess &&
      res?.data?.map(patient => {
        return {
          id: patient.patient_id,
          name: patient.patient.name,
          email: patient.patient.email,
          phone_number: patient.patient.phone_number,
          patient_number: patient.patient_number,
          // institution: patient.institution_id,
        };
      }),
    [res?.data, isSuccess]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => (
          <Tooltip label={`${value} - Click to copy`} aria-label="A tooltip">
            <Box display="flex" position="relative">
              <Box
                as="span"
                onClick={() => {
                  setClipboardValue(value);
                  onCopy();
                }}
              >
                {value?.substring(0, 5)}
              </Box>
              {hasCopied && clipboardValue === value && (
                <Box
                  as="span"
                  display="inline-block"
                  fontSize="sm"
                  bg="gray.200"
                  color="gray.600"
                  fontStyle="italic"
                  fontWeight="semibold"
                  position="absolute"
                  right="-4"
                  px="1"
                  rounded="md"
                >
                  Copied!
                </Box>
              )}
            </Box>
          </Tooltip>
        ),
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Email',
        accessor: 'email',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Phone',
        accessor: 'phone_number',
        Cell: ({ value }) => (value ? value : '-'),
      },
      {
        Header: 'Patient Number',
        accessor: 'patient_number',
      },
    ],
    [hasCopied, onCopy, clipboardValue]
  );

  return (
    <Box>
      {isFetching && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <BackButton to="/events" text="Back to Events List" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Registered Patient List
      </Heading>
      {user?.role?.alias === 'super-admin' && (
        <FormControl id="name" mb="4" maxW="xs">
          <FormLabel>Institution</FormLabel>
          <Select
            name="institution"
            value={selectedInstitution}
            onChange={e => setSelectedInstitution(e.target.value)}
          >
            <option value="">Select Institution</option>
            {isSuccessInstitution &&
              resInstitution?.data?.map(institution => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
          </Select>
        </FormControl>
      )}
      {selectedInstitution && (
        <PaginationTable
          columns={columns}
          data={data || []}
          isLoading={isLoading}
          skeletonCols={5}
          action={
            <PrivateComponent permission={Permissions.createRegistration}>
              <HStack spacing="4">
                <ImportPatients
                  cookies={cookies}
                  selectedInstitution={selectedInstitution}
                />

                <Button
                  as={Link}
                  to="/events/registration/create"
                  colorScheme="purple"
                  // w="full"
                  px="10"
                >
                  Register Patient
                </Button>
              </HStack>
            </PrivateComponent>
          }
        />
      )}
    </Box>
  );
};

const ImportPatients = ({ cookies, selectedInstitution }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    // formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();

  const fileWatch = watch('file');

  const onSubmit = async values => {
    console.log({ values });
    console.log('hit');
    const data = new FormData();
    data.append('file', values.file[0]);

    try {
      setIsLoading(true);
      await importPatient(cookies, data);
      await queryClient.invalidateQueries([
        'hospital-patients',
        selectedInstitution,
      ]);
      setIsLoading(false);
      reset();
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Import successful`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        position: 'top-right',
        title: 'Error',
        description: `Import failed`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <HStack
      as="form"
      backgroundColor="gray.200"
      py="1"
      px="3"
      rounded="lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        type="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        {...register('file')}
      />
      <Button
        type="submit"
        size="sm"
        colorScheme="green"
        disabled={fileWatch?.length === 0}
        isLoading={isLoading}
      >
        Import
      </Button>
    </HStack>
  );
};
