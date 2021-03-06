import { Box, Flex, Icon } from '@chakra-ui/react';
import React from 'react';
import { FaHospitalSymbol } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Logo = props => {
  return (
    <Link to="/">
      <Flex
        mb="10"
        alignItems="center"
        justifyContent="center"
        ml="-7"
        {...props}
      >
        <Icon as={FaHospitalSymbol} w="12" h="12" fill="blue.600" mr="3" />
        <Box>
          <Box as="span" fontSize="2xl" fontWeight="Bold">
            SMART-RS
          </Box>
        </Box>
      </Flex>
    </Link>
  );
};
