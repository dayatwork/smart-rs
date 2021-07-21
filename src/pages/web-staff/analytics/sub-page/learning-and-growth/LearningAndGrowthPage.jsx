import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

import { LearningGrowthCharts } from './LearningGrowthCharts';
import { BackButton } from 'components/shared/BackButton';

export const LearningAndGrowthPage = () => {
  return (
    <Box>
      <BackButton to="/analytics" text="Back to Analytics" />
      <Heading
        mb={{ base: '3', '2xl': '6' }}
        fontSize={{ base: '2xl', '2xl': '3xl' }}
      >
        Pembelajaran & Pertumbuhan
      </Heading>
      <LearningGrowthCharts />
    </Box>
  );
};
