import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { HiSpeakerphone } from 'react-icons/hi';

import { AuthContext } from '../../../contexts/authContext';
import { AppShell } from '../../../components/web-staff/shared/app-shell';
import { ContentWrapper } from '../../../components/web-staff/shared/sub-menu';
import { InstitutionStatistics, BookingStatistics } from './components';

import { getInstitutions } from '../../../api/institution-services/institution';

const DashboardPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity }
  );

  return (
    <AppShell>
      <Helmet>
        <title>Dashboard | SMART-RS</title>
      </Helmet>
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full">
          <ContentWrapper>
            <Flex justify="space-between" mb={{ base: '3', '2xl': '6' }}>
              <Heading fontSize={{ base: '3xl', '2xl': '4xl' }}>
                Dashboard
              </Heading>
              <Button
                colorScheme="purple"
                as={Link}
                to="/dashboard/advertisement/create"
                leftIcon={<HiSpeakerphone />}
              >
                Create Advertisement
              </Button>
            </Flex>
            {user?.role?.alias === 'super-admin' && (
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
            )}
            <InstitutionStatistics
              selectedInstitution={selectedInstitution}
              cookies={cookies}
            />

            <BookingStatistics
              selectedInstitution={selectedInstitution}
              cookies={cookies}
            />
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default DashboardPage;
