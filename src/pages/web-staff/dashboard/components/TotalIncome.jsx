import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Circle,
  Heading,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';

import { getIncomeList } from '../../../../api/finance-services/income';

import { HiCurrencyDollar } from 'react-icons/hi';

export const TotalIncome = ({ selectedInstitution, cookies }) => {
  const headingSize = useBreakpointValue({ base: 'lg', '2xl': 'xl' });

  const {
    data: res,
    isLoading,
    isSuccess,
  } = useQuery(
    ['income-list', selectedInstitution],
    () => getIncomeList(cookies, selectedInstitution),
    {
      enabled: Boolean(selectedInstitution),
    }
  );

  const total =
    res?.data?.reduce((acc, curVal) => {
      return acc + Number(curVal.total);
    }, 0) || 0;

  return (
    <Box bg="white" p={{ base: '6', '2xl': '10' }} rounded="xl" shadow="base">
      <VStack mx="auto" spacing={{ base: '1', '2xl': '3' }}>
        <Box
          color="gray.600"
          fontWeight="medium"
          fontSize={{ base: 'lg', '2xl': 'xl' }}
        >
          Total Income
        </Box>
        <HStack spacing={{ base: '2', '2xl': '3' }}>
          <Circle flexShrink={0} size="6" bg="green.500" color="white">
            <HiCurrencyDollar />
          </Circle>
          <Heading as="h1" size={headingSize} fontWeight="bold">
            {currencyFormatter.format(total)}
          </Heading>
        </HStack>
      </VStack>
    </Box>
  );
};

export const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});
