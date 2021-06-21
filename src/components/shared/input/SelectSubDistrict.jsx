import React from 'react';
import { useQuery } from 'react-query';
import { Select } from '@chakra-ui/react';

import { getSubDistricts } from '../../../api/other-services/address';

export const SelectSubDistrict = React.forwardRef(
  ({ province, city, district, setValue, defaultValue, ...rest }, ref) => {
    const { data: dataSubDistricts } = useQuery(
      ['sub-districts', district],
      () => getSubDistricts(district),
      { enabled: Boolean(district) },
    );

    React.useEffect(() => {
      setTimeout(() => {
        setValue('sub_district', defaultValue);
      }, 2000);
    }, [province, city, district, defaultValue, setValue]);

    return (
      <Select
        name="sub_district"
        placeholder="Pilih Kelurahan/ Desa"
        ref={ref}
        defaultValue={defaultValue}
        {...rest}>
        {dataSubDistricts?.kelurahan.map((subDistrict) => (
          <option key={subDistrict.id} value={subDistrict.id}>
            {subDistrict.nama}
          </option>
        ))}
      </Select>
    );
  },
);
