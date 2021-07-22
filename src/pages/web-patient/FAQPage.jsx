import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';

import { getFAQCategoryList, getFAQList } from 'api/application-services/faq';
import { WebPatientNav, Wrapper } from 'components/web-patient/shared';

const FAQPage = () => {
  const [cookies] = useCookies(['token']);
  const [selectedCategory, setSelectedCategory] = useState();

  const {
    data: dataFAQCategory,
    // isSuccess: isSuccessFAQCategory,
    isLoading: isLoadingFAQCategory,
  } = useQuery(['faq-category'], () => getFAQCategoryList(cookies), {
    staleTime: Infinity,
  });

  console.log({ dataFAQCategory });

  const {
    data: dataFAQ,
    // isSuccess: isSuccessFAQ,
    isLoading: isLoadingFAQ,
  } = useQuery(['faq'], () => getFAQList(cookies), { staleTime: Infinity });

  // const faqs = dataFAQCategory?.data?.map(category => ({
  //   id: category?.id,
  //   name: category?.name,
  //   items: dataFAQ?.data?.filter(faq => faq.category_id === category.id),
  // }));
  const faqs = dataFAQ?.data?.filter(
    faq => faq.category_id === selectedCategory
  );

  useEffect(() => {
    if (dataFAQCategory?.data?.length) {
      setSelectedCategory(dataFAQCategory?.data[0]?.id);
    }
  }, [dataFAQCategory?.data]);

  return (
    <Flex direction="column" bg="gray.100" minH="100vh">
      <WebPatientNav active="faq" />
      <Box bg="secondary.dark" py="10">
        <Box maxW="7xl" mx="auto">
          <Heading color="white" fontSize="2xl">
            Frequency Asked Question
          </Heading>
        </Box>
      </Box>
      <Wrapper>
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
          <>
            <Grid gridTemplateColumns="repeat(4,1fr)" gap="8">
              <GridItem
                mb="2"
                fontSize="md"
                pl="1"
                fontWeight="bold"
                color="gray.600"
                textTransform="uppercase"
              >
                Category
              </GridItem>
              <GridItem
                colSpan={3}
                mb="2"
                fontSize="md"
                pl="1"
                fontWeight="bold"
                color="gray.600"
                textTransform="uppercase"
              >
                FAQ
              </GridItem>
            </Grid>
            <Grid gridTemplateColumns="repeat(4,1fr)" gap="8">
              <GridItem>
                <Box
                  as="ul"
                  listStyleType="none"
                  bg="white"
                  boxShadow="md"
                  rounded="md"
                  overflow="hidden"
                >
                  {dataFAQCategory?.data?.map(category => (
                    <Box
                      key={category.id}
                      as="li"
                      py="4"
                      px="6"
                      borderBottom="1px"
                      borderColor="gray.200"
                      fontSize="lg"
                      fontWeight="semibold"
                      bgColor={
                        selectedCategory === category.id && 'secondary.dark'
                      }
                      color={selectedCategory === category.id && 'white'}
                      cursor="pointer"
                      _hover={{
                        bgColor:
                          selectedCategory === category.id
                            ? 'secondary.darker'
                            : 'secondary.light',
                      }}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Box>
                  ))}
                </Box>
              </GridItem>
              <GridItem colSpan={3}>
                <Box>
                  <Accordion
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
                              fontSize="lg"
                              fontWeight="bold"
                              px="4"
                              py="2"
                              // textTransform="uppercase"
                            >
                              {faq.question}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          <Box px="4" py="1">
                            {faq.answer}
                          </Box>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Box>
              </GridItem>
            </Grid>
          </>
        )}
      </Wrapper>
    </Flex>
  );
};

export default FAQPage;
