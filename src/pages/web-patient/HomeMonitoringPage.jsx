import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  useRadio,
  useRadioGroup,
  VStack,
  Image,
  Button,
  Heading,
  Divider,
} from '@chakra-ui/react';

import { BsCaretLeftFill } from 'react-icons/bs';

import { WebPatientNav, Wrapper } from 'components/web-patient/shared';
import svg0 from '../../assets/severity/0.svg';
// import svg1 from '../../assets/severity/1.svg';
import svg2 from '../../assets/severity/2.svg';
import svg3 from '../../assets/severity/3.svg';
// import svg4 from '../../assets/severity/4.svg';
import svg5 from '../../assets/severity/5.svg';
// import svg6 from '../../assets/severity/6.svg';
import svg7 from '../../assets/severity/7.svg';
// import svg8 from '../../assets/severity/8.svg';
// import svg9 from '../../assets/severity/9.svg';
import svg10 from '../../assets/severity/10.svg';

const HomeMonitoringPage = () => {
  // const [feelingBetter, setFeelingBeeter] = useState('no');
  const [isMedicineHelp, setIsMedicineHelp] = useState('');
  const [severity, setSeverity] = useState('');
  const options1 = ['yes', 'no'];
  const severityOptions = [
    {
      text: 'No Pain',
      icon: svg0,
    },
    // {
    //   text: 'Very Mild',
    //   icon: svg1,
    // },
    {
      text: 'Mild Pain',
      icon: svg2,
    },
    {
      text: 'Moderate Pain ',
      icon: svg3,
    },
    // {
    //   text: 'Distressing',
    //   icon: svg4,
    // },
    {
      text: 'Severe Pain',
      icon: svg5,
    },
    // {
    //   text: 'Intense',
    //   icon: svg6,
    // },
    {
      text: 'Very Severe Pain',
      icon: svg7,
    },
    // {
    //   text: 'Horrible',
    //   icon: svg8,
    // },
    // {
    //   text: 'Unbearable',
    //   icon: svg9,
    // },
    {
      text: 'Worst Pain Possible',
      icon: svg10,
    },
  ];

  // const { getRootProps: getRootProps1, getRadioProps: getRadioProps1 } =
  //   useRadioGroup({
  //     name: 'feeling_better',
  //     defaultValue: feelingBetter,
  //     onChange: v => setFeelingBeeter(v),
  //   });

  const { getRootProps: getRootProps2, getRadioProps: getRadioProps2 } =
    useRadioGroup({
      name: 'severity',
      defaultValue: severity,
      onChange: v => setSeverity(v),
    });

  const { getRootProps: getRootProps3, getRadioProps: getRadioProps3 } =
    useRadioGroup({
      name: 'is_medicine_help',
      defaultValue: isMedicineHelp,
      onChange: v => setIsMedicineHelp(v),
    });

  // console.log({ feelingBetter });
  console.log({ isMedicineHelp });
  console.log({ severity });

  // const group1 = getRootProps1();
  const group2 = getRootProps2();
  const group3 = getRootProps3();

  return (
    <Flex direction="column" bg="gray.100" minH="100vh">
      <WebPatientNav />
      <Box bg="secondary.dark" py="10">
        <Box maxW="7xl" mx="auto">
          <Heading color="white" fontSize="2xl">
            Home Monitoring
          </Heading>
        </Box>
      </Box>
      <Wrapper>
        <Box
          as={Link}
          to="/"
          display="inline-flex"
          alignItems="center"
          color="secondary.dark"
          fontSize="sm"
          fontWeight="semibold"
          mb="4"
          rounded="lg"
          px="2"
          py="1"
          _hover={{ bg: 'gray.50' }}
        >
          <Box as={BsCaretLeftFill} fontSize="xs" marginEnd="1" />
          Back to Home
        </Box>
        <Box boxShadow="md" py="8" px="12" bg="white">
          <Flex justify="space-between">
            <Box>
              <Heading size="lg">Home Monitoring</Heading>
              <Heading size="md">Day 0</Heading>
            </Box>
            <Box>
              <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                {new Date().toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                Dr. John Doe
              </Text>
            </Box>
          </Flex>
          <Divider mt="6" mb="4" />
          {/* <Box>
            <Text fontSize="2xl" fontWeight="semibold">
              1. Are you feeling better today?
            </Text>
            <Box p="6">
              <HStack {...group1}>
                {options1.map(value => {
                  const radio = getRadioProps1({ value });
                  return (
                    <RadioCard key={value} {...radio}>
                      {value}
                    </RadioCard>
                  );
                })}
              </HStack>
            </Box>
          </Box> */}
          <Box>
            <Text fontSize="2xl" fontWeight="semibold">
              1. From scale 0 to 10, how would you rate your symptoms?
            </Text>
            <Box p="6">
              <SimpleGrid columns={6} gap="4" {...group2}>
                {severityOptions.map(({ text, icon }, index) => {
                  const radio = getRadioProps2({ value: text });
                  return (
                    <RadioCard key={text} {...radio}>
                      <VStack>
                        <Text>{index * 2}</Text>
                        <Image src={icon} w="16" />
                        <Text fontSize="sm" textTransform="none">
                          {text}
                        </Text>
                      </VStack>
                    </RadioCard>
                  );
                })}
              </SimpleGrid>
            </Box>
          </Box>
          <Box>
            <Text fontSize="2xl" fontWeight="semibold">
              2. Does drinking the medicine helps in alleviating the pain?
            </Text>
            <Box p="6">
              <HStack {...group3}>
                {options1.map(value => {
                  const radio = getRadioProps3({ value });
                  return (
                    <RadioCard key={value} {...radio}>
                      {value}
                    </RadioCard>
                  );
                })}
              </HStack>
            </Box>
          </Box>

          <Flex justify="flex-end" p="6">
            <Button size="lg" ml="auto" colorScheme="primary" as={Link} to="/">
              Submit
            </Button>
          </Flex>
        </Box>
      </Wrapper>
    </Flex>
  );
};

export default HomeMonitoringPage;

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
        fontSize="lg"
        fontWeight="bold"
        textTransform="uppercase"
      >
        {props.children}
      </Box>
    </Box>
  );
}
