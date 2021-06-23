/* eslint-disable react/display-name */
import React, { useState, useContext } from 'react';
import {
  Link,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
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

import { AuthContext } from '../../../contexts/authContext';
import { getInstitutions } from '../../../api/institution-services/institution';
import { WaitingPatient } from '../event-node/sub-page/examination/WaitingPatient';
import { ActivePatient } from '../event-node/sub-page/examination/ActivePatient';
import { HistoryPatient } from '../event-node/sub-page/examination/HistoryPatient';
import { AppShell } from '../../../components/web-staff/shared/app-shell';
import { ContentWrapper } from '../../../components/web-staff/shared/sub-menu';

const subMenus = [
  {
    to: '/patient',
    text: 'Waiting Patient',
  },
  {
    to: '/patient/active',
    text: 'Active Patient',
  },
  {
    to: '/patient/history',
    text: 'History',
  },
];

export const PatientPage = () => {
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
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <ContentWrapper>
            <Box>
              <Heading mb="6">Patient</Heading>
              {user?.role?.alias && (
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
              <SimpleGrid columns="3">
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
                <Route exact path={path}>
                  <WaitingPatient
                    selectedInstitution={selectedInstitution}
                    fromPatientMenu
                  />
                </Route>
                <Route exact path={`${path}/active`}>
                  <ActivePatient
                    selectedInstitution={selectedInstitution}
                    fromPatientMenu
                  />
                </Route>
                <Route exact path={`${path}/history`}>
                  <HistoryPatient
                    selectedInstitution={selectedInstitution}
                    fromPatientMenu
                  />
                </Route>
              </Switch>
            </Box>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
