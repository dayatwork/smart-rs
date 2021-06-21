import { Box } from '@chakra-ui/react';
import * as React from 'react';

const properties = {
  top: {
    transform: 'skew(var(--arrow-skew))',
    borderToOmit: 'borderBottom',
  },
  bottom: {
    transform: 'skew(calc(var(--arrow-skew) * -1))',
    borderToOmit: 'borderTop',
  },
};

export const SkewBox = ({ placement, isCurrent, ...rest }) => {
  const defaultColor = 'white';
  const accentColor = 'blue.500';

  const { borderToOmit, transform } = properties[placement];
  const placementProps = {
    [placement]: 0,
    transform,
    [borderToOmit]: '0',
    borderColor: isCurrent ? accentColor : undefined,
  };

  return (
    <Box
      aria-hidden
      bg={isCurrent ? accentColor : defaultColor}
      borderWidth="1px"
      position="absolute"
      height="50%"
      // _groupHover={{
      //   bg: !isCurrent ? hoverBgColor : undefined,
      // }}
      _groupFocus={{
        border: '2px solid',
        borderColor: 'blue.200',
        [borderToOmit]: '0',
      }}
      width="full"
      {...placementProps}
      {...rest}
    />
  );
};
