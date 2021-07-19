/* eslint-disable react/display-name */
import React from 'react';
import { Box, Heading, Text, Textarea } from '@chakra-ui/react';

import PaginationTable from 'components/shared/tables/PaginationTable';

export const Monitoring = ({ patientDetail, dataSoap }) => {
  const data = React.useMemo(
    () => [
      {
        id: 1,
        date: '18 June 2021 08:42:23',
        feeling_well: 'Yes',
        severity: 7,
        drug_works: 'No',
      },
      {
        id: 2,
        date: '19 June 2021 11:32:11',
        feeling_well: 'No',
        severity: 4,
        drug_works: 'Yes',
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Date & Time',
        accessor: 'date',
      },
      {
        Header: 'Patient Feeling Well',
        accessor: 'feeling_well',
      },
      {
        Header: 'Patient Severity Scale (1-10)',
        accessor: 'severity',
      },
      {
        Header: 'Does drugs work?',
        accessor: 'drug_works',
      },
    ],
    []
  );

  return (
    <>
      <Box bg="white" boxShadow="md" px="8" py="6" overflow="auto">
        <Heading fontSize="lg" fontWeight="semibold" mb="8">
          Monitoring
        </Heading>

        <PaginationTable data={data || []} columns={columns} />
        <Box mt="-10" mb="4">
          <Text mb="2" color="gray.600" fontWeight="semibold">
            Doctor's Note
          </Text>
          <Textarea rows={5} />
        </Box>
      </Box>
    </>
  );
};
