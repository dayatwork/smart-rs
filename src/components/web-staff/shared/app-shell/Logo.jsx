import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { FaHospitalSymbol } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { AuthContext } from '../../../../contexts/authContext';
import { getInstitutions } from '../../../../api/institution-services/institution';
// import { menus } from './menus';

export const Logo = ({ mini, mobile, ...rest }) => {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  // const { pathname } = useLocation();

  const { data: dataInstitutions, isLoading: isLoadingInstitution } = useQuery(
    'institutions',
    () => getInstitutions(cookies)
    // { staleTime: Infinity, cacheTime: Infinity }
  );

  // const onlyLogo = mini || menus.map(menu => menu.to).includes(pathname);

  return (
    <Box
      px="4"
      py="2"
      // h="16"
      display="flex"
      alignItems="center"
      bgColor="purple.600"
      {...rest}
    >
      <Link to="/dashboard">
        <Flex alignItems="center" justify="center">
          <Icon
            as={FaHospitalSymbol}
            w="10"
            h="10"
            fill="white"
            mr={{ base: 3, md: mini ? '0' : '3' }}
            ml={{ base: mobile ? 0 : '10', md: mini ? '5' : '0' }}
            // mr="3"
          />
          {mini && !mobile ? null : (
            <Box display={{ base: mobile ? 'block' : 'none', md: 'block' }}>
              <Text
                fontSize="lg"
                color="white"
                fontWeight="bold"
                lineHeight="5"
                mb="1.5"
              >
                {/* HOSPITAL */}
                {dataInstitutions?.data?.find(
                  institution =>
                    institution.id === employeeDetail?.institution_id
                )?.name ||
                  (user?.role?.alias === 'super-admin' && 'Admin SMART-RS')}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="purple.200"
                mt="-1.5"
              >
                {!isLoadingInstitution && 'SMART RS'}
              </Text>
            </Box>
          )}
        </Flex>
      </Link>
    </Box>
  );
};
