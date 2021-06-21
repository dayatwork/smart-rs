import React from 'react';
import { Select } from '@chakra-ui/react';

import provinceData from '../../../data/province.json';

const ProvinceSelect = ({ ...rest }, ref) => {
  return (
    <Select
      name="province"
      placeholder="Pilih provinsi"
      ref={ref}
      // value={province}
      // onChange={(e) => setProvince(e.target.value)}
      {...rest}>
      {provinceData.map((prov) => (
        <option key={prov.id} value={prov.id}>
          {prov.nama}
        </option>
      ))}
    </Select>
  );
};

export const SelectProvince = React.forwardRef(ProvinceSelect);
