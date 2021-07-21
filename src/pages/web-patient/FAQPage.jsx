import React from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { BsCaretLeftFill } from 'react-icons/bs';
import { useCookies } from 'react-cookie';

import { getFAQCategoryList, getFAQList } from 'api/application-services/faq';
import { WebPatientNav, Wrapper } from 'components/web-patient/shared';

const FAQPage = () => {
  const [cookies] = useCookies(['token']);

  const {
    data: dataFAQCategory,
    // isSuccess: isSuccessFAQCategory,
    isLoading: isLoadingFAQCategory,
  } = useQuery(['faq-category'], () => getFAQCategoryList(cookies), {
    staleTime: Infinity,
  });

  const {
    data: dataFAQ,
    // isSuccess: isSuccessFAQ,
    isLoading: isLoadingFAQ,
  } = useQuery(['faq'], () => getFAQList(cookies), { staleTime: Infinity });

  const faqs = dataFAQCategory?.data?.map(category => ({
    id: category?.id,
    name: category?.name,
    items: dataFAQ?.data?.filter(faq => faq.category_id === category.id),
  }));

  return (
    <Flex direction="column" bg="gray.100" minH="100vh">
      <WebPatientNav />
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
        <Box maxW="4xl" mx="auto">
          <Heading textAlign="center" mb="6">
            Frequently asked questions
          </Heading>
          {isLoadingFAQ || isLoadingFAQCategory ? (
            <Center h="60">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="secondary.light"
                color="secondary.dark"
                size="xl"
              />
            </Center>
          ) : (
            <Accordion
              defaultIndex={dataFAQCategory?.data?.map((_, index) => index)}
              allowMultiple
              bg="white"
              boxShadow="sm"
              rounded="md"
            >
              {faqs?.map(faq => (
                <AccordionItem key={faq.id}>
                  <h2>
                    <AccordionButton>
                      <Box
                        flex="1"
                        textAlign="left"
                        fontSize="xl"
                        fontWeight="bold"
                        // textTransform="uppercase"
                      >
                        {faq.name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {faq?.items?.map((data, index) => (
                      <Box key={data.id} mb="4">
                        <Text fontWeight="semibold">{data.question}</Text>
                        <Text>{data.answer}</Text>
                        {faq.items.length - 1 !== index && <Divider py="1" />}
                      </Box>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Box>
      </Wrapper>
    </Flex>
  );
};

export default FAQPage;
