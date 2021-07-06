import * as React from 'react';

function SvgComponent(props) {
  return (
    <svg
      width={64}
      height={64}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <path fill="url(#prefix__pattern0)" d="M0 0h64v64H0z" />
      <defs>
        <pattern
          id="prefix__pattern0"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <use xlinkHref="#prefix__image0" transform="scale(.01563)" />
        </pattern>
        <image
          id="prefix__image0"
          width={64}
          height={64}
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}

export default SvgComponent;
