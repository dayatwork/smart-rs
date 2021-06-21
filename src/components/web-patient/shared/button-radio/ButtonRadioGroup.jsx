import { Stack, useRadioGroup } from '@chakra-ui/react';
import * as React from 'react';

import { ButtonRadio } from './ButtonRadio';

export const ButtonRadioGroup = (props) => {
  const {
    options,
    setPatient,
    setPatientData,
    setSelectedService,
    setSelectedDayRange,
    ...rest
  } = props;
  const { getRadioProps, getRootProps } = useRadioGroup(rest);

  return (
    <Stack
      justify="center"
      direction={{ base: 'column', md: 'row' }}
      spacing="3"
      {...getRootProps()}>
      {options.map((option) => (
        <ButtonRadio
          onClick={() => {
            setPatient(option.value);
            setPatientData({});
            setSelectedService('');
            setSelectedDayRange({
              from: undefined,
              to: undefined,
            });
          }}
          key={option.value}
          icon={option.icon}
          description={option.description}
          label={option.label}
          {...getRadioProps({ value: option.value })}
        />
      ))}
    </Stack>
  );
};
