import React, { useState, useContext } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';

import { AuthContext } from '../../../../../contexts/authContext';
import { getInstitutions } from '../../../../../api/institution-services/institution';
import { BackButton } from '../../../../../components/shared/BackButton';
import { LabPatientList } from './LabPatientList';
import { LabResultList } from './LabResultList';

export const BloodTestList = () => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedInstitution, setSelectedInstitution] = useState(
    employeeDetail?.institution_id || ''
  );

  const { data: resInstitution, isSuccess: isSuccessInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies)
  );

  return (
    <Box>
      <BackButton to="/events" text="Back to Events List" />
      <Heading mb="6" fontSize="3xl">
        Blood Test
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
      <Tabs mx="auto" overflowX="auto" size="lg" colorScheme="purple">
        <TabList>
          <Tab fontSize="2xl" fontWeight="semibold">
            Patient List
          </Tab>
          <Tab fontSize="2xl" fontWeight="semibold">
            Result List
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box py="6">
              <LabPatientList selectedInstitution={selectedInstitution} />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box py="6">
              <LabResultList selectedInstitution={selectedInstitution} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
