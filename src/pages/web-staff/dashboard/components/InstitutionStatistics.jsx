import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { FaUserInjured } from 'react-icons/fa';

import { SimpleStat } from 'components/shared/stat';
import { getTotalPatients } from 'api/patient-services/statistics';

export const InstitutionStatistics = ({ selectedInstitution, cookies }) => {
  const { data: dataTotalBooking, isSuccess: isSuccessTotatBooking } = useQuery(
    ['statistic-total-patient', selectedInstitution],
    () => getTotalPatients(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  return (
    <SimpleGrid columns={4} mb="6">
      <SimpleStat
        label="Total Pasien"
        total={dataTotalBooking?.total || 0}
        isCounting={isSuccessTotatBooking}
        icon={FaUserInjured}
        mode="stack"
      />
    </SimpleGrid>
  );
};
