import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { FaHospitalSymbol } from 'react-icons/fa';

import { menus } from './menus';

export const Logo = ({ mini, ...rest }) => {
  const { pathname } = useLocation();

  const onlyLogo = mini || menus.map((menu) => menu.to).includes(pathname);

  return (
    <Box
      px="4"
      py="2"
      h="16"
      display="flex"
      alignItems="center"
      bgColor="purple.600"
      {...rest}>
      <Link to="/dashboard">
        <Flex alignItems="center" justify="center">
          <Icon
            as={FaHospitalSymbol}
            w="10"
            h="10"
            fill="white"
            mr={!onlyLogo ? '0' : '3'}
          />
          {onlyLogo && (
            <Box>
              <Text fontSize="xl" color="white" fontWeight="bold">
                HOSPITAL
              </Text>
              <Text fontSize="md" fontWeight="semibold" color="purple.200" mt="-1.5">
                Dashboard
              </Text>
            </Box>
          )}
        </Flex>
      </Link>
    </Box>
  );
};
