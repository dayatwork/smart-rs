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
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../api/institution-services/institution';
import { BackButton } from '../../../../../components/shared/BackButton';
import { WaitingPatient } from './WaitingPatient';
import { ActivePatient } from './ActivePatient';
import { HistoryPatient } from './HistoryPatient';
import { PrivateRoute, Permissions } from '../../../../../access-control';

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
    <Box>
      <BackButton to="/events" text="Back to Events List" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Examination
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
      <SimpleGrid columns="3">
        {subMenus.map(subMenu => (
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
          <WaitingPatient selectedInstitution={selectedInstitution} />
        </PrivateRoute>
        <PrivateRoute
          permission={Permissions.indexExamination}
          exact
          path={`${path}/active`}
        >
          <ActivePatient selectedInstitution={selectedInstitution} />
        </PrivateRoute>
        <PrivateRoute
          permission={Permissions.indexExamination}
          exact
          path={`${path}/history`}
        >
          <HistoryPatient selectedInstitution={selectedInstitution} />
        </PrivateRoute>
      </Switch>
    </Box>
  );
};
