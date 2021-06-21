import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue as mode,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react';
import React from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const PasswordField = (props, ref) => {
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = React.useRef(null);

  const mergeRef = useMergeRefs(inputRef, ref);

  const onClickReveal = () => {
    onToggle();
    const input = inputRef.current;
    if (input) {
      input.focus({ preventScroll: true });
      const length = input.value.length * 2;
      requestAnimationFrame(() => {
        input.setSelectionRange(length, length);
      });
    }
  };

  return (
    <FormControl id="password" isInvalid={props?.errors?.password ? true : false}>
      <Flex justify="space-between">
        <FormLabel>Password</FormLabel>
        {props.forgot === 'true' && (
          <Link to="/forgot-password">
            <Box color={mode('blue.600', 'blue.200')} fontWeight="semibold" fontSize="sm">
              Lupa password?
            </Box>
          </Link>
        )}
      </Flex>
      <InputGroup>
        <InputRightElement>
          <IconButton
            bg="transparent !important"
            variant="ghost"
            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
            icon={isOpen ? <HiEyeOff /> : <HiEye />}
            onClick={onClickReveal}
          />
        </InputRightElement>
        <Input
          ref={mergeRef}
          name="password"
          type={isOpen ? 'text' : 'password'}
          autoComplete="current-password"
          // required
          {...props}
        />
      </InputGroup>
      <FormErrorMessage>
        {props?.errors?.password && props.errors.password.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default React.forwardRef(PasswordField);
