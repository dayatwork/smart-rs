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
  // const defaultColor = 'secondary.light';
  // const accentColor = 'secondary.dark';
  const defaultColor = 'white';
  const accentColor = 'primary.500';

  const { borderToOmit, transform } = properties[placement];
  const placementProps = {
    [placement]: 0,
    transform,
    [borderToOmit]: '0',
    borderColor: isCurrent ? accentColor : 'gray.300',
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
        borderColor: 'secondary.dark',
        [borderToOmit]: '0',
      }}
      width="full"
      {...placementProps}
      {...rest}
    />
  );
};
