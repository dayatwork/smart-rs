import { Box, Flex } from '@chakra-ui/react';
import * as React from 'react';

import { SkewBox } from './SkewBox';
import { StepContent } from './StepContent';

export const Step = ({ children, isCurrent }) => {
  const color = 'white';
  return (
    <Box as="li" flex="1">
      <Box outline={0} className="group" width="full">
        <Flex
          align="center"
          height="10"
          justify="center"
          position="relative"
          // css={{ '--arrow-skew': '20deg' }}
          css={{ '--arrow-skew': '35deg' }}
        >
          <SkewBox isCurrent={isCurrent} placement="top" />
          <StepContent color={isCurrent ? color : 'inherit'}>
            {children}
          </StepContent>
          <SkewBox isCurrent={isCurrent} placement="bottom" />
        </Flex>
      </Box>
    </Box>
  );
};
