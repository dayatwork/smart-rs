import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

import { FinanceCharts } from './FinanceCharts';
import { BackButton } from 'components/shared/BackButton';

export const FinancePage = () => {
  return (
    <Box>
      <BackButton to="/analytics" text="Back to Analytics" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Keuangan
      </Heading>
      <FinanceCharts />
    </Box>
  );
};
