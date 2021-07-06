import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text, VisuallyHidden } from '@chakra-ui/react';

import LogoRS from '../../../assets/Logo';

// import { FaHospitalSymbol } from 'react-icons/fa';
// import LogoSvg from './Logo.svg';

// export const Logo = (props) => {
//   const { iconColor = 'currentColor', ...rest } = props;
//   const color = useToken('colors', iconColor);
//   return <Icon as={FaHospitalSymbol} fill={color} {...rest} />;
// };

export const Logo = ({ mini, mobile, light, ...rest }) => {
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
      <VisuallyHidden>Logo</VisuallyHidden>
      <Flex
        bg={light ? 'white' : 'secondary.dark'}
        h="16"
        px="4"
        align="center"
        mr={mini || mobile ? null : '10'}
        aria-label="logo"
        {...rest}
      >
        {/* <Icon
          as={FaHospitalSymbol}
          w="10"
          h="10"
          fill={light ? 'blue.600' : 'white'}
          mr={mini ? null : '3'}
        /> */}
        {/* <Image src={LogoSvg} alt="logo" w="12" mr={mini ? null : '3'} /> */}
        <LogoRS width={mini ? 55 : 60} height={mini ? 55 : 60} />
        {mini ? null : (
          <Box ml={mini ? null : '1'}>
            <Text
              fontSize="lg"
              color={light ? 'primary.500' : 'white'}
              fontWeight="bold"
            >
              SMART-RS
            </Text>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={light ? 'secondary.dark' : 'white'}
              mt="-1.5"
            >
              Web Pasien
            </Text>
          </Box>
        )}
      </Flex>
    </Link>
  );
};
