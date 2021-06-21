/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { Link, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Select,
  SimpleGrid,
  Center,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getInstitutions } from '../../../../../api/institution-services/institution';
import { BackButton } from '../../../../../components/shared/BackButton';
import { WaitingPatient } from './WaitingPatient';
import { ActivePatient } from './ActivePatient';
import { HistoryPatient } from './HistoryPatient';

const subMenus = [
  {
    to: '/events/examination',
    text: 'Waiting Patient',
  },
  {
    to: '/events/examination/active',
    text: 'Active Patient',
  },
  {
    to: '/events/examination/history',
    text: 'History',
  },
];

export const ExaminationPage = () => {
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    '3f026d44-6b43-47ce-ba4b-4d0a8b174286',
  );

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies),
    { staleTime: Infinity },
  );

  return (
    <Box>
      <BackButton to="/events" text="Back to Events List" />
      <Heading mb="6" fontSize="3xl">
        Examination
      </Heading>
      <FormControl id="name" mb="4" maxW="xs">
        <FormLabel>Institution</FormLabel>
        <Select
          name="institution"
          value={selectedInstitution}
          onChange={(e) => setSelectedInstitution(e.target.value)}>
          <option value="">Select Institution</option>
          {isSuccessInstitution &&
            resInstitution?.data?.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
        </Select>
      </FormControl>
      <SimpleGrid columns="3">
        {subMenus.map((subMenu) => (
          <Center
            key={subMenu.to}
            as={Link}
            to={subMenu.to}
            borderBottom="2px"
            borderColor={pathname === subMenu.to ? 'purple.600' : 'transparent'}
            py="2"
            fontSize="xl"
            fontWeight="bold"
            color={pathname === subMenu.to ? 'purple.600' : 'gray.800'}
            _hover={{ bgColor: 'purple.100' }}>
            {subMenu.text}
          </Center>
        ))}
      </SimpleGrid>
      <Switch>
        <Route exact path={path}>
          <WaitingPatient selectedInstitution={selectedInstitution} />
        </Route>
        <Route exact path={`${path}/active`}>
          <ActivePatient selectedInstitution={selectedInstitution} />
        </Route>
        <Route exact path={`${path}/history`}>
          <HistoryPatient selectedInstitution={selectedInstitution} />
        </Route>
      </Switch>
    </Box>
  );
};