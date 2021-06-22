import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  useDisclosure,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getInstitutions } from '../../../../../api/institution-services/institution';
import { getRadiologyList } from '../../../../../api/radiology-services/radiology';
import PaginationTable from '../../../../../components/shared/tables/PaginationTable';
import { ImagingDetailsModal } from '../../../../../components/web-staff/event-node/imaging';

export const ImagingList = () => {
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    '3f026d44-6b43-47ce-ba4b-4d0a8b174286'
  );
  const [selectedRadiology, setSelectedRadiology] = useState(null);

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  const {
    data: dataRadiologyList,
    isSuccess: isSuccessRadiologyList,
    isLoading: isLoadingRadiologyList,
    isFetching: isFetchingRadiologyList,
  } = useQuery(
    ['radiology-list', selectedInstitution],
    () => getRadiologyList(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  const handleStart = useCallback(
    detail => {
      setSelectedRadiology(detail);
      onDetailOpen();
    },
    [onDetailOpen]
  );

  const data = React.useMemo(
    () =>
      isSuccessRadiologyList &&
      dataRadiologyList?.data?.map(radiology => {
        // console.log("radiology", radiology);
        return {
          id: radiology?.id,
          patient_id: radiology?.patient_id,
          patient_name: radiology?.patient_data?.name,
          patient_number: radiology?.patient_data?.patient_number,
          radiology_type: radiology?.type_data?.name,
          soap_id: radiology?.soap_id,
          employee_name: radiology?.employee_data?.name,
          status: radiology?.status,
          date: radiology?.date,
          type_name: radiology?.type_data?.name,
          description: radiology?.description,
          time: radiology?.time,
        };
      }),
    [dataRadiologyList?.data, isSuccessRadiologyList]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <Box>{value?.substring(0, 5)}...</Box>,
      },
      {
        Header: 'Patient Name',
        accessor: 'patient_name',
      },
      {
        Header: 'Radiology Type',
        accessor: 'type_name',
      },
      {
        Header: 'Employee Name',
        accessor: 'employee_name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          if (value === 'requested') {
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
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Time',
        accessor: 'time',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          // console.log({ row });
          // if (row.original.status === "Done") {
          //   return (
          //     <Button
          //       variant="link"
          //       size="sm"
          //       colorScheme="purple"
          //       as={Link}
          //       to={`/events/imaging/${row.original.id}`}
          //     >
          //       Details
          //     </Button>
          //   );
          // }
          if (row.original.status === 'requested') {
            return (
              <Button
                // variant="link"
                size="sm"
                colorScheme="purple"
                onClick={() => handleStart(row.original)}
              >
                Start
              </Button>
            );
          }
          if (row.original.status === 'process') {
            return (
              <Button
                as={Link}
                variant="link"
                colorScheme="purple"
                to={`/events/imaging/details/${row.original.id}`}
              >
                Details
              </Button>
            );
          }
          return null;
          // return (
          //   <Button
          //     as={Link}
          //     variant="link"
          //     colorScheme="purple"
          //     to={`/events/imaging/details/${row.original.id}`}
          //   >
          //     Details
          //   </Button>
          // );
        },
      },
    ],
    [handleStart]
  );

  console.log({ dataRadiologyList });

  return (
    <>
      {isFetchingRadiologyList && (
        <Spinner top="10" right="12" position="absolute" colorScheme="purple" />
      )}
      <Box py={{ base: '0', lg: '4' }}>
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
        <ImagingDetailsModal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          selectedRadiology={selectedRadiology}
        />
        <Box>
          <Button
            display={{ base: 'inline-flex', lg: 'none' }}
            as={Link}
            to="/events"
            leftIcon={<FaArrowLeft />}
            mb="4"
          >
            Events
          </Button>
          <Flex justify="space-between" align="center" mb="4">
            <Heading fontSize="3xl">Imaging</Heading>
          </Flex>
          <PaginationTable
            columns={columns}
            data={data || []}
            isLoading={isLoadingRadiologyList}
            skeletonCols={9}
            // action={
            //   <Button
            //     colorScheme="purple"
            //     onClick={onOpenRequestRadiologyModal}
            //   >
            //     Tambah Imaging
            //   </Button>
            // }
          />
        </Box>
      </Box>
    </>
  );
};
