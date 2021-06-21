// City = Regency (Kota / Kabupaten)
import React from 'react';
import { useQuery } from 'react-query';
import { Select } from '@chakra-ui/react';

import { getCities } from '../../../api/other-services/address';

export const SelectCity = React.forwardRef(
  ({ province, setValue, defaultValue, ...rest }, ref) => {
    const { data: dataCities } = useQuery(
      ['cities', province],
      () => getCities(province),
      { enabled: Boolean(province) },
    );

    React.useEffect(() => {
      setTimeout(() => {
        setValue('city', defaultValue);
      }, 1000);
    }, [province, defaultValue, setValue]);

    return (
      <Select
        name="city"
        placeholder="Pilih Kota/ Kabupaten"
        ref={ref}
        defaultValue={defaultValue}
        // value={city}
        // onChange={(e) => setCity(e.target.value)}
        {...rest}>
        {dataCities?.kota_kabupaten.map((city) => (
          <option key={city.id} value={city.id}>
            {city.nama}
          </option>
        ))}
      </Select>
    );
  },
);
