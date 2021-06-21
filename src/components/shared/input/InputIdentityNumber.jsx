import React from 'react';
import { Input } from '@chakra-ui/react';

const InputIdentity = ({ setValue, ...rest }, ref) => {
  return (
    <Input
      name="identity_number"
      type="number"
      ref={ref}
      onInput={(e) =>
        setValue('identity_number', e.target.value.slice(0, e.target.maxLength))
      }
      maxLength="16"
      {...rest}
    />
  );
};

export const InputIdentityNumber = React.forwardRef(InputIdentity);
