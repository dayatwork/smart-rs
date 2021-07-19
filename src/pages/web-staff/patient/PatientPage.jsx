/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import { Link, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Select,
  SimpleGrid,
  Center,
  Flex,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';

import { AuthContext } from '../../../contexts/authContext';
import { getInstitutions } from '../../../api/institution-services/institution';
import { WaitingPatient } from '../event-node/sub-page/examination/WaitingPatient';
import { ActivePatient } from '../event-node/sub-page/examination/ActivePatient';
import { HomeMonitoringPatient } from '../event-node/sub-page/examination/HomeMonitoringPatient';
import { HistoryPatient } from '../event-node/sub-page/examination/HistoryPatient';
import { AppShell } from '../../../components/web-staff/shared/app-shell';
import { ContentWrapper } from '../../../components/web-staff/shared/sub-menu';
import { PrivateRoute, Permissions } from '../../../access-control';

const subMenus = [
  {
    to: '/patient',
    text: 'Pasien Tunggu',
  },
  {
    to: '/patient/active',
    text: 'Pasien Aktif',
  },
  {
    to: '/patient/home-monitoring',
    text: 'Pasien Monitoring',
  },
  {
    to: '/patient/history',
    text: 'History',
  },
];

const PatientPage = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
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
        <title>Patient | SMART-RS</title>
      </Helmet>
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full">
          <ContentWrapper>
            <Box>
              <Heading
                mb={{ base: '3', '2xl': '6' }}
                fontSize={{ base: '3xl', '2xl': '4xl' }}
              >
                Patient
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
              <SimpleGrid columns="4">
                {subMenus.map(subMenu => (
                  <Center
                    key={subMenu.to}
                    as={Link}
                    to={subMenu.to}
                    borderBottom="2px"
                    borderColor={
                      pathname === subMenu.to ? 'purple.600' : 'transparent'
                    }
                    py="2"
                    fontSize="xl"
                    fontWeight="bold"
                    color={pathname === subMenu.to ? 'purple.600' : 'gray.800'}
                    _hover={{ bgColor: 'purple.100' }}
                  >
                    {subMenu.text}
                  </Center>
                ))}
              </SimpleGrid>
              <Switch>
                <PrivateRoute
                  permission={Permissions.indexExamination}
                  exact
                  path={path}
                >
                  <WaitingPatient
                    selectedInstitution={selectedInstitution}
                    fromPatientMenu
                  />
                </PrivateRoute>
                <PrivateRoute
                  permission={Permissions.indexExamination}
                  exact
                  path={`${path}/active`}
                >
                  <ActivePatient
                    selectedInstitution={selectedInstitution}
                    fromPatientMenu
                  />
                </PrivateRoute>
                <PrivateRoute
                  permission={Permissions.indexExamination}
                  exact
                  path={`${path}/home-monitoring`}
                >
                  <HomeMonitoringPatient
                    selectedInstitution={selectedInstitution}
                    fromPatientMenu
                  />
                </PrivateRoute>
                <PrivateRoute
                  permission={Permissions.indexExamination}
                  exact
                  path={`${path}/history`}
                >
                  <HistoryPatient
                    selectedInstitution={selectedInstitution}
                    fromPatientMenu
                  />
                </PrivateRoute>
              </Switch>
            </Box>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default PatientPage;
