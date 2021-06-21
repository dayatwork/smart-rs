import { Icon, useToken } from '@chakra-ui/react';
import * as React from 'react';
import { FaHospitalSymbol } from 'react-icons/fa';

export const Logo = (props) => {
  const { iconColor = 'currentColor', ...rest } = props;
  const color = useToken('colors', iconColor);
  return <Icon as={FaHospitalSymbol} fill={color} {...rest} />;
};
