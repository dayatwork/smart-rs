import React, { useState } from 'react';
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { AppShell } from '../../../components/web-staff/shared/app-shell';
import { ContentWrapper } from '../../../components/web-staff/shared/sub-menu';
import { BookingStatus, BookingChart } from './components';

import { getInstitutions } from '../../../api/institution-services/institution';

export const DashboardPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    // '3f026d44-6b43-47ce-ba4b-4d0a8b174286'
    '4676c84e-13a1-4e09-ba8f-caf89e9ca2a9'
  );

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  return (
    <AppShell>
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <ContentWrapper>
            <Heading mb="6">Dashboard</Heading>
            <FormControl id="name" mb="6" maxW="xs">
              <FormLabel>Institution</FormLabel>
              <Select
                bgColor="white"
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
            <Heading fontSize="xl" mb="4">
              Booking Statistics
            </Heading>
            <BookingStatus selectedInstitution={selectedInstitution} />
            <Divider my="4" />
            <Heading fontSize="xl" mb="4">
              Booking Chart
            </Heading>
            <BookingChart selectedInstitution={selectedInstitution} />
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
