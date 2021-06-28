import * as React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Box, Flex, Text } from '@chakra-ui/react';
import { FaHospitalSymbol } from 'react-icons/fa';

// export const Logo = (props) => {
//   const { iconColor = 'currentColor', ...rest } = props;
//   const color = useToken('colors', iconColor);
//   return <Icon as={FaHospitalSymbol} fill={color} {...rest} />;
// };

export const Logo = ({ mini, light, ...rest }) => {
  return (
    // <Box
    //   px="4"
    //   py="2"
    //   // h="16"
    //   display="flex"
    //   alignItems="center"
    //   bgColor="purple.600"
    //   {...rest}
    // >
    <Link to="/">
      <Flex mr={mini ? null : '10'} {...rest}>
        <Icon
          as={FaHospitalSymbol}
          w="10"
          h="10"
          fill={light ? 'blue.600' : 'white'}
          mr={mini ? null : '3'}
        />
        {mini ? null : (
          <Box>
            <Text
              fontSize="lg"
              color={light ? 'blue.600' : 'white'}
              fontWeight="bold"
            >
              SMART-RS
            </Text>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={light ? 'blue.600' : 'white'}
              mt="-1.5"
            >
              Web Patient
            </Text>
          </Box>
        )}
      </Flex>
    </Link>
  );
};
