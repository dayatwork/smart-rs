import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { FaUserInjured, FaUser, FaUserMd, FaUserTie } from 'react-icons/fa';

import { SimpleStat } from 'components/shared/stat';
import { getTotalPatients } from 'api/patient-services/statistics';

export const InstitutionStatistics = ({ selectedInstitution, cookies }) => {
  const { data: dataTotalBooking, isSuccess: isSuccessTotatBooking } = useQuery(
    ['statistic-total-patient', selectedInstitution],
    () => getTotalPatients(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  return (
    <SimpleGrid columns={4} mb="6" gap="10">
      <SimpleStat
        label="Total User"
        total={120}
        isCounting={isSuccessTotatBooking}
        icon={FaUser}
        mode="stack"
        color="purple.600"
      />
      <SimpleStat
        label="Total Pasien"
        total={dataTotalBooking?.total || 0}
        isCounting={isSuccessTotatBooking}
        icon={FaUserInjured}
        mode="stack"
        color="purple.600"
      />
      <SimpleStat
        label="Total Dokter"
        total={21}
        isCounting={isSuccessTotatBooking}
        icon={FaUserMd}
        mode="stack"
        color="purple.600"
      />
      <SimpleStat
        label="Total Staff"
        total={65}
        isCounting={isSuccessTotatBooking}
        icon={FaUserTie}
        mode="stack"
        color="purple.600"
      />
    </SimpleGrid>
  );
};
