import React from 'react';
import { Select } from '@chakra-ui/react';

import gender from '../../../data/gender.json';

const GenderSelect = ({ ...rest }, ref) => {
  return (
    <Select name="gender" placeholder="Pilih jenis kelamin" ref={ref} {...rest}>
      {gender.map((type) => (
        <option value={type.value} key={type.value}>
          {type.text}
        </option>
      ))}
    </Select>
  );
};

export const SelectGender = React.forwardRef(GenderSelect);
