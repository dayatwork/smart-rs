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
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../api/institution-services/institution';
import { getHospitalPatients } from '../../../../../api/patient-services/hospital-patient';
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
      <Heading mb="6" fontSize="3xl">
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
              <Button
                as={Link}
                to="/events/registration/create"
                colorScheme="purple"
              >
                Register New Patient
              </Button>
            </PrivateComponent>
          }
        />
      )}
    </Box>
  );
};
