import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { FaUserInjured, FaUser, FaUserMd, FaUserTie } from 'react-icons/fa';

import { SimpleStat } from 'components/shared/stat';
import { getTotalPatients } from 'api/patient-services/statistics';
import { getTotalEmployees } from 'api/human-capital-services/statistics';

export const InstitutionStatistics = ({ selectedInstitution, cookies }) => {
  const { data: dataTotalPatients, isSuccess: isSuccessTotalPatients } =
    useQuery(
      ['statistic-total-patient', selectedInstitution],
      () => getTotalPatients(cookies, selectedInstitution),
      { enabled: Boolean(selectedInstitution) }
    );

  const { data: dataTotalEmployees } = useQuery(
    ['statistic-total-employee', selectedInstitution],
    () => getTotalEmployees(cookies, selectedInstitution),
    { enabled: Boolean(selectedInstitution) }
  );

  // const {
  //   data: res,
  //   isSuccess,
  //   isLoading,
  //   isFetching,
  // } = useQuery(
  //   ['accounts', selectedInstitution],
  //   () => getAccounts(cookies, selectedInstitution),
  //   { enabled: Boolean(selectedInstitution) }
  // );

  // console.log({ selectedInstitution });
  // console.log({ dataTotalPatients });
  // console.log({ dataTotalEmployees });

  return (
    <SimpleGrid columns={3} mb="6" gap="6">
      <SimpleStat
        label="Total User"
        total={
          Number(dataTotalPatients?.data || 0) +
          Number(dataTotalEmployees?.total || 0)
        }
        isCounting={isSuccessTotalPatients}
        icon={FaUser}
        mode="stack"
        color="purple.600"
      />
      <SimpleStat
        label="Total Pasien"
        total={dataTotalPatients?.data || 0}
        isCounting={isSuccessTotalPatients}
        icon={FaUserInjured}
        mode="stack"
        color="purple.600"
      />
      {/* <SimpleStat
        label="Total Doctor"
        total={dataTotalEmployees?.data || 25}
        isCounting={isSuccessTotalEmployees}
        icon={FaUserMd}
        mode="stack"
        color="purple.600"
      /> */}
      <SimpleStat
        label="Total Staff"
        total={dataTotalEmployees?.total || 0}
        isCounting={isSuccessTotalPatients}
        icon={FaUserTie}
        mode="stack"
        color="purple.600"
      />
    </SimpleGrid>
  );
};
