import React, { useState } from 'react';
import { css } from '@emotion/css';
import { useMergeRefs } from '@chakra-ui/react';
import { Eye } from './assets/Eye';
import { EyeSlash } from './assets/EyeSlash';

import { colors } from '../../../theme';

export const InputPassword = React.forwardRef(
  ({ id, label, error, ...rest }, ref) => {
    const [type, setType] = useState('password');
    const inputRef = React.useRef(null);

    const mergeRef = useMergeRefs(inputRef, ref);

    const handleTypeChange = () => {
      if (type === 'password') {
        setType('text');
      } else {
        setType('password');
      }
      inputRef.current.focus();
    };

    return (
      <div>
        <div
          className={css`
            heigth: 40px;
            width: 100%;
            position: relative;

            input {
              height: 100%;
              width: 100%;
              border: none;
              border: 2px solid ${error ? '#E53E3E' : '#e2e8f0'};
              padding: 12px 12px 10px 12px;
              border-radius: 6px;
            }

            input:focus {
              outline: none;
              border-color: ${error ? '#E53E3E' : colors.primary[500]};
            }

            input:focus ~ label,
            input:not(:placeholder-shown) ~ label {
              transform: translateY(-26px) translateX(-3px);
              font-size: 14px;
              font-weight: 500;
              background-color: white;
              padding: 0 4px;
              color: ${error ? '#E53E3E' : colors.primary[500]};
            }

            label {
              position: absolute;
              bottom: 12px;
              left: 16px;
              color: gray;
              transition: all 0.2s ease;
            }

            .show-password {
              position: absolute;
              bottom: 12px;
              right: 16px;
              height: 20px;
              width: 20px;
            }
          `}
        >
          <input
            placeholder=" "
            id={id || label}
            type={type}
            ref={mergeRef}
            {...rest}
          />
          <label htmlFor={id || label}>{label}</label>
          <button
            type="button"
            className="show-password"
            onClick={handleTypeChange}
          >
            {type === 'password' ? <EyeSlash /> : <Eye />}
          </button>
        </div>
        {error && error?.message && (
          <p style={{ fontSize: 14, color: '#E53E3E' }}>{error.message}</p>
        )}
      </div>
    );
  }
);
