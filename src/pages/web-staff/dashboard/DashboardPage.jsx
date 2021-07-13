import React, { useState, useContext } from 'react';
import {
  Box,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';

import { AuthContext } from '../../../contexts/authContext';
import { AppShell } from '../../../components/web-staff/shared/app-shell';
import { ContentWrapper } from '../../../components/web-staff/shared/sub-menu';
import { BookingStatus, BookingChart } from './components';

import { getInstitutions } from '../../../api/institution-services/institution';
// import { getBookingList } from '../../../api/booking-services/booking';
import { getBookingStatistic } from '../../../api/booking-services/statistic';

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

  // const { data: dataBookingList, isLoading: isLoadingBookingList } = useQuery(
  //   ['booking-list', selectedInstitution],
  //   () => getBookingList(cookies, selectedInstitution),
  //   { enabled: Boolean(selectedInstitution) }
  // );

  const { data: dataTotal, isLoading: isLoadingTotal } = useQuery(
    ['booking-statistic'],
    () => getBookingStatistic(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
    }
  );
  const { data: dataCancel, isLoading: isLoadingCancel } = useQuery(
    ['booking-statistic', 'cancel'],
    () => getBookingStatistic(cookies, selectedInstitution, 'cancel'),
    {
      enabled: Boolean(selectedInstitution),
    }
  );
  const { data: dataCheckedIn, isLoading: isLoadingCheckedIn } = useQuery(
    ['booking-statistic', 'done'],
    () => getBookingStatistic(cookies, selectedInstitution, 'done'),
    {
      enabled: Boolean(selectedInstitution),
    }
  );
  const { data: dataExamination, isLoading: isLoadingExamination } = useQuery(
    ['booking-statistic', 'examination'],
    () => getBookingStatistic(cookies, selectedInstitution, 'done'),
    {
      enabled: Boolean(selectedInstitution),
    }
  );

  return (
    <AppShell>
      <Helmet>
        <title>Dashboard | SMART-RS</title>
      </Helmet>
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full">
          <ContentWrapper>
            <Heading
              mb={{ base: '3', '2xl': '6' }}
              fontSize={{ base: '3xl', '2xl': '4xl' }}
            >
              Dashboard
            </Heading>
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
            {isLoadingTotal ||
            isLoadingCancel ||
            isLoadingCheckedIn ||
            isLoadingExamination ? (
              <Center py="10">
                <Spinner
                  thickness="4px"
                  emptyColor="gray.200"
                  color="purple.500"
                  size="xl"
                />
              </Center>
            ) : (
              <>
                <Heading
                  fontSize={{ base: 'lg', '2xl': 'xl' }}
                  mb={{ base: '2', '2xl': '4' }}
                >
                  Booking Statistics
                </Heading>
                <>
                  <BookingStatus
                    // selectedInstitution={selectedInstitution}
                    // dataBookingList={dataBookingList}
                    total={dataTotal?.total}
                    cancel={dataCancel?.total}
                    checkedIn={dataCheckedIn?.total}
                    examination={dataExamination?.total}
                  />
                </>
                <Divider my={{ base: '2', '2xl': '4' }} />
                <Heading
                  fontSize={{ base: 'lg', '2xl': 'xl' }}
                  mb={{ base: '2', '2xl': '4' }}
                >
                  Booking Chart
                </Heading>
                <BookingChart
                  selectedInstitution={selectedInstitution}
                  // dataBookingList={dataBookingList}
                />
              </>
            )}
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default DashboardPage;
