import React, { useState, useCallback } from 'react';
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  useDisclosure,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { getInstitutions } from '../../../../../api/institution-services/institution';
import {
  getLaboratoryRegistrationList,
  generateQRCodeLaboratoryRegistration,
} from '../../../../../api/laboratory-services/register';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';
import { BackButton } from '../../../../../components/shared/BackButton';
import { StartLabTestModal } from '../../../../../components/web-staff/event-node/blood-draw';

export const BloodDrawList = () => {
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    '3f026d44-6b43-47ce-ba4b-4d0a8b174286'
  );
  const [isLoadingGenerateQR, setIsLoadingGenerateQR] = useState(false);
  const [currentQR, setCurrentQR] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies)
  );

  const {
    data: dataLaboratoryList,
    isSuccess: isSuccessLaboratoryList,
    isLoading: isLoadingLaboratoryList,
    isFetching: isFetchingLaboratoryList,
  } = useQuery(
    ['laboratory-registration-list', selectedInstitution],
    () => getLaboratoryRegistrationList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const {
    isOpen: isOpenStartLabModal,
    onOpen: onOpenStartLabModal,
    onClose: onCloseStartLabModal,
  } = useDisclosure();

  const handleStartBloodTest = useCallback(
    async (id, patient_id) => {
      const data = { id, patient_id };
      const patientLab = dataLaboratoryList?.data.find(
        patientLab => patientLab.id === id
      );
      setSelectedPatient(patientLab);
      try {
        setIsLoadingGenerateQR(true);
        const res = await generateQRCodeLaboratoryRegistration(cookies)(data);
        setIsLoadingGenerateQR(false);
        // setIsDisabledGenerateQR(false);
        setCurrentQR(res?.data);

        onOpenStartLabModal();
      } catch (error) {}
    },
    [cookies, onOpenStartLabModal, dataLaboratoryList?.data]
  );

  const data = React.useMemo(
    () =>
      isSuccessLaboratoryList &&
      dataLaboratoryList?.data?.map(laboratory => {
        return {
          id: laboratory?.id,
          patient_id: laboratory?.patient_id,
          patient_name: laboratory?.patient_data?.name,
          patient_number: laboratory?.patient_data?.patient_number,
          laboratory_category: laboratory?.category_data?.name,
          soap_id: laboratory?.soap_id,
          employee_name: laboratory?.employee_data?.name,
          status: laboratory?.status,
          date: laboratory?.date,
          description: laboratory?.description,
          time: laboratory?.time,
          location: laboratory?.location,
        };
      }),
    [dataLaboratoryList?.data, isSuccessLaboratoryList]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Patient ID',
        accessor: 'patient_id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Patient Name',
        accessor: 'patient_name',
      },
      {
        Header: 'Lab Category',
        accessor: 'laboratory_category',
      },
      {
        Header: 'Employee Name',
        accessor: 'employee_name',
      },

      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Time',
        accessor: 'time',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value === 'pending') {
            return <Badge colorScheme="orange">{value}</Badge>;
          }
          if (value === 'process') {
            return <Badge colorScheme="blue">{value}</Badge>;
          }
          if (value === 'completed') {
            return <Badge colorScheme="green">{value}</Badge>;
          }
          return <Badge>{value}</Badge>;
        },
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          if (row.original.status === 'pending') {
            return (
              <Button
                onClick={e =>
                  handleStartBloodTest(row.original.id, row.original.patient_id)
                }
                name={row.original.id}
                colorScheme="purple"
                size="sm"
                isLoading={isLoadingGenerateQR}
              >
                Start
              </Button>
            );
          }
          return null;
        },
      },
    ],
    [handleStartBloodTest, isLoadingGenerateQR]
  );

  return (
    <Box>
      {isFetchingLaboratoryList && (
        <Spinner top="8" right="12" position="absolute" color="purple" />
      )}
      <StartLabTestModal
        isOpen={isOpenStartLabModal}
        onClose={onCloseStartLabModal}
        currentQR={currentQR}
        selectedPatient={selectedPatient}
      />
      <BackButton to="/events" text="Back to Events List" />
      <Heading mb="6" fontSize="3xl">
        Blood Draw List
      </Heading>

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
      {selectedInstitution && (
        <PaginationTable
          columns={columns}
          data={data || []}
          skeletonCols={11}
          isLoading={isLoadingLaboratoryList}
          // action={
          //   <Button colorScheme="purple" onClick={onOpenRequestLabModal}>
          //     Tambah Tes Darah
          //   </Button>
          // }
        />
      )}
    </Box>
  );
};
