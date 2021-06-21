import React from 'react';
import { useQuery } from 'react-query';
import { Select } from '@chakra-ui/react';

import { getDistricts } from '../../../api/other-services/address';

export const SelectDistrict = React.forwardRef(
  ({ province, city, setValue, defaultValue, ...rest }, ref) => {
    const { data: dataDistricts } = useQuery(
      ['districts', city],
      () => getDistricts(city),
      { enabled: Boolean(city) },
    );

    React.useEffect(() => {
      setTimeout(() => {
        setValue('district', defaultValue);
      }, 1500);
    }, [province, city, defaultValue, setValue]);

    return (
      <Select
        name="district"
        placeholder="Pilih Kecamatan"
        ref={ref}
        defaultValue={defaultValue}
        // value={district}
        // onChange={(e) => setDistrict(e.target.value)}
        {...rest}>
        {dataDistricts?.kecamatan.map((district) => (
          <option key={district.id} value={district.id}>
            {district.nama}
          </option>
        ))}
      </Select>
    );
  },
);
