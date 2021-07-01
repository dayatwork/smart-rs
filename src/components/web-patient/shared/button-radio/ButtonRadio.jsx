import {
  Box,
  chakra,
  Text,
  useColorModeValue as mode,
  useId,
  useRadio,
  VStack,
} from '@chakra-ui/react';
import * as React from 'react';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

const RadioBox = chakra('div', {
  baseStyle: {
    borderWidth: '3px',
    px: '6',
    pt: '12',
    pb: '8',
    borderRadius: 'md',
    cursor: 'pointer',
    transition: 'all 0.2s',
    _focus: { shadow: 'outline' },
  },
});

const CheckboxIcon = props => (
  <Box
    fontSize="4xl"
    color={
      props.checked ? 'secondary.dark' : mode('gray.300', 'whiteAlpha.400')
    }
  >
    {props.checked ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
  </Box>
);

export const ButtonRadio = props => {
  const { label, icon, description, onClick } = props;
  const { getCheckboxProps, getInputProps, getLabelProps, state } =
    useRadio(props);
  const id = useId();

  const checkedStyles = {
    bg: mode('secondary.light', 'rgb(0 31 71)'),
    borderColor: 'secondary.dark',
  };

  return (
    <label style={{ width: '100%' }} {...getLabelProps()}>
      <input {...getInputProps()} aria-labelledby={id} />
      <RadioBox
        {...getCheckboxProps()}
        _checked={checkedStyles}
        id={id}
        onClick={onClick}
      >
        <VStack spacing="4">
          <VStack textAlign="center">
            <Box
              aria-hidden
              fontSize="4xl"
              mb="3"
              color={state.isChecked ? 'secondary.dark' : undefined}
            >
              {icon}
            </Box>
            <Text fontWeight="extrabold" fontSize="xl">
              {label}
            </Text>
            <Text fontSize="sm">{description}</Text>
          </VStack>
          <CheckboxIcon checked={state.isChecked} />
        </VStack>
      </RadioBox>
    </label>
  );
};
