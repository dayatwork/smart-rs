import React, { useContext, useState, useEffect } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  HStack,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  VisuallyHidden,
  // Link as ChakraLink,
  Text,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Avatar,
  useDisclosure,
} from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
// import { BsArrowRight } from 'react-icons/bs';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { HiOutlineEmojiHappy, HiOutlineEmojiSad } from 'react-icons/hi';

import LogoRS from 'assets/Logo';
import { AuthContext } from 'contexts/authContext';
import { getAdvertisements } from 'api/institution-services/advertisement';
import { getInstitutions } from 'api/institution-services/institution';
import { getServices } from 'api/master-data-services/service';
import { AdvertisementCard } from 'components/web-patient/home';
import { Notification, ProfileDropdown } from 'components/web-patient/shared';
import {
  RiDashboardFill,
  RiHistoryFill,
  RiStethoscopeFill,
} from 'react-icons/ri';
import { HiHome } from 'react-icons/hi';
import { MdQuestionAnswer } from 'react-icons/md';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,

    // partialVisibilityGutter: 40,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    // partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 2,
    // partialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
    // partialVisibilityGutter: 40,
  },
};

export default function HomePage() {
  const { employeeDetail, user } = useContext(AuthContext);
  const [cookies] = useCookies(['token']);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const timer = setTimeout(() => onOpen(), 10000);

    return () => clearTimeout(timer);
  }, [onOpen]);

  const { data: dataAdvertisement, isLoading } = useQuery(
    ['advertisement'],
    () => getAdvertisements(cookies),
    { staleTime: Infinity }
  );

  const { data: dataServices, isLoading: isLoadingService } = useQuery(
    'services',
    () => getServices(cookies)
  );
  const { data: dataInstitutions, isLoading: isLoadingInstitutions } = useQuery(
    'institutions',
    () => getInstitutions(cookies)
  );

  // console.log({ dataServices });
  // console.log({ selectedDay });
  // console.log({ dataInstitutions });

  return (
    <Box minH="100vh" position="relative" bg="gray.100" pb="10">
      <Helmet>
        <style>{customStyle}</style>
      </Helmet>
      <HomeMonitoringModal isOpen={isOpen} onClose={onClose} />
      <Box
        as="section"
        bg="gray.800"
        py="12"
        position="relative"
        h="50vh"
        bgImage="url(newbg.jpg)"
        bgSize="cover"
        bgPosition="center"
        _after={{
          content: `""`,
          display: 'block',
          w: 'full',
          h: 'full',
          bgGradient:
            'linear(to-r, black, blackAlpha.900, blackAlpha.400, transparent)',
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: 0.8,
        }}
      >
        <Box
          maxW={{
            base: 'xl',
            md: '7xl',
          }}
          mx="auto"
          px={{
            base: '6',
            md: '8',
          }}
          zIndex={1}
          position="relative"
        >
          <Flex
            flexDirection="column"
            color="white"
            h="full"
            // mt={{ base: '20', md: '38' }}
            mt={{ base: '20', md: '28' }}
          >
            <Heading size="3xl" fontWeight="bold" mb="4">
              Welcome
            </Heading>
            {/* <Heading size="2xl" fontWeight="bold" mb="4">
              di SMART RS
            </Heading> */}
            <Heading size="xl" fontWeight="semibold">
              {user?.name}
            </Heading>
          </Flex>
        </Box>

        <Box
          position="absolute"
          zIndex={2}
          w="full"
          top="0"
          py="3"
          _after={{
            content: `""`,
            display: 'block',
            w: 'full',
            h: '180px',
            bgGradient:
              'linear(to-b, blackAlpha.800, blackAlpha.700, blackAlpha.300, transparent)',
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <Box
            maxW={{
              base: 'xl',
              md: '7xl',
            }}
            mx="auto"
          >
            <Flex
              px={{
                base: '6',
                md: '8',
              }}
              justify="space-between"
              align="center"
            >
              <HStack zIndex="10" spacing="6">
                <Flex>
                  <LogoRS width={65} height={65} />
                  <Box mr="4" ml="2">
                    <Text fontSize="2xl" color="white" fontWeight="bold">
                      SMART-RS
                    </Text>

                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      color="white"
                      mt="-1.5"
                    >
                      Web Pasien
                    </Text>
                  </Box>
                </Flex>
                <HStack
                  display={{ base: 'none', md: 'flex' }}
                  as="ul"
                  listStyleType="none"
                  spacing="4"
                  color="white"
                  bg="transparent"
                  fontWeight="semibold"
                  fontSize="md"
                  zIndex="10"
                >
                  <HStack
                    as="li"
                    _hover={{ bgColor: 'whiteAlpha.300' }}
                    bgColor="whiteAlpha.100"
                    cursor="pointer"
                    px="3"
                    py="1"
                    rounded="md"
                  >
                    <Icon as={HiHome} w="5" h="5" />
                    <Link to="/">Home</Link>
                  </HStack>
                  <HStack
                    as="li"
                    _hover={{ bgColor: 'whiteAlpha.300' }}
                    bgColor="whiteAlpha.100"
                    cursor="pointer"
                    px="3"
                    py="1"
                    rounded="md"
                  >
                    <Icon as={RiHistoryFill} w="5" h="5" />
                    <Link to="/doctor">Transaction History</Link>
                  </HStack>
                  <HStack
                    as="li"
                    _hover={{ bgColor: 'whiteAlpha.300' }}
                    bgColor="whiteAlpha.100"
                    cursor="pointer"
                    px="3"
                    py="1"
                    rounded="md"
                  >
                    <Icon as={RiStethoscopeFill} w="5" h="5" />
                    <Link to="/examination">Service History</Link>
                  </HStack>
                  <HStack
                    as="li"
                    _hover={{ bgColor: 'whiteAlpha.300' }}
                    bgColor="whiteAlpha.100"
                    cursor="pointer"
                    px="3"
                    py="1"
                    rounded="md"
                  >
                    <Icon as={MdQuestionAnswer} w="5" h="5" />
                    <Link to="/faq">FAQ</Link>
                  </HStack>
                </HStack>
              </HStack>

              <HStack spacing="4" zIndex="10">
                {(employeeDetail?.employee_id ||
                  user?.role?.alias === 'super-admin') && (
                  <Button
                    display={{ base: 'none', lg: 'inline-flex' }}
                    as={Link}
                    to="/dashboard"
                    bg="white"
                    colorScheme="primary"
                    size="sm"
                    variant="ghost"
                    leftIcon={<RiDashboardFill />}
                  >
                    Dashboard Staff
                  </Button>
                )}
                <Notification
                  display={{ base: 'none', lg: 'inline-flex' }}
                  light
                />
                <Box display={{ base: 'none', lg: 'block' }}>
                  <ProfileDropdown />
                </Box>
              </HStack>
            </Flex>
          </Box>
        </Box>
      </Box>
      <Box
        maxW="7xl"
        mx="auto"
        px={{
          base: '6',
          md: '8',
        }}
        position="absolute"
        top={{ base: '30vh', md: '45vh' }}
        right="0"
        left="0"
      >
        <Stack
          bg="white"
          direction={{ base: 'column', md: 'row' }}
          spacing="4"
          px={{
            base: '8',
            md: '10',
          }}
          py={{ base: '10', md: '8' }}
          border="1px"
          borderColor="gray.200"
          boxShadow="md"
          rounded="md"
          w="full"
          // ml="8"
          // mr="8"
        >
          <FormControl id="service">
            <VisuallyHidden>Layanan</VisuallyHidden>
            <Select
              size="lg"
              value={selectedService}
              onChange={e => {
                setSelectedService(e.target.value);
              }}
              disabled={isLoadingService}
            >
              <option value="">All Service</option>
              {dataServices?.data?.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="schedule">
            <VisuallyHidden>Schedule</VisuallyHidden>
            <DayPickerInput
              onDayChange={setSelectedDay}
              value={selectedDay}
              placeholder="All Schedule"
              dayPickerProps={{
                disabledDays: { before: new Date() },
              }}
            />
          </FormControl>
          <FormControl id="institution">
            <VisuallyHidden>Hospital</VisuallyHidden>
            <Select
              size="lg"
              value={selectedInstitution}
              onChange={e => {
                setSelectedInstitution(e.target.value);
              }}
              disabled={isLoadingInstitutions}
            >
              <option value="">All Hospitals</option>
              {dataInstitutions?.data?.map(institution => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Button
              w="full"
              colorScheme="primary"
              size="lg"
              as={Link}
              // to="/doctor/booking"
              to={{
                pathname: '/doctor/booking',
                state: {
                  selectedService,
                  selectedDay,
                  selectedInstitution,
                },
              }}
            >
              Search
            </Button>
          </Box>
        </Stack>
      </Box>

      <Box
        mt={{ base: '40', md: '24' }}
        maxW="7xl"
        mx="auto"
        px={{ base: '6', md: '8' }}
      >
        <Heading size="lg" mb="6" fontWeight="bold">
          News & Promotion
        </Heading>
        {/* {isLoading ? (
          <SimpleGrid
            columns={{
              base: 1,
              md: 3,
            }}
            spacing="10"
            mb="6"
          >
            <Skeleton height="400px" rounded="md" />
            <Skeleton height="400px" rounded="md" />
            <Skeleton height="400px" rounded="md" />
          </SimpleGrid>
        ) : (
          <Carousel
            responsive={responsive}
            autoPlay
            autoPlaySpeed={4000}
            infinite
          >
     
            {dataAdvertisement?.data?.slice(0, 4)?.map(advertisement => (
              <Box key={advertisement.id} px="4">
                <AdvertisementCard
                  category={advertisement.category}
                  media={`${process.env.REACT_APP_UPLOADED_FILE_URL}/${advertisement.image}`}
                  title={advertisement.title}
                  description={advertisement.content}
                  href="#"
                  author={{
                    name: 'SMART-RS',
                    href: '#',
                  }}
                />
              </Box>
            ))}

          </Carousel>
        )} */}
      </Box>
    </Box>
  );
}

const HomeMonitoringModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Home Monitoring</ModalHeader>
        {/* <ModalCloseButton /> */}
        <ModalBody pb={6}>
          <Flex>
            <Avatar
              src="/images/doctor.jpg"
              alt="doctor photo"
              size="xl"
              mr="10"
            />
            <Box mt="2">
              <Text fontSize="2xl" fontWeight="semibold">
                Are you feeling better?
              </Text>
              <Text fontWeight="semibold" color="gray.500">
                {new Date().toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            leftIcon={
              <HiOutlineEmojiHappy
                style={{ width: 25, height: 25, marginLeft: -5 }}
              />
            }
            colorScheme="green"
            onClick={onClose}
            mr={3}
            // minW="300"
          >
            Yes
          </Button>
          <Button
            leftIcon={
              <HiOutlineEmojiSad
                style={{ width: 25, height: 25, marginLeft: -5 }}
              />
            }
            colorScheme="red"
            as={Link}
            to="/home-monitoring"
          >
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const customStyle = `
.DayPickerInput input {
  border: 1px solid #e2e8f0;
  padding: 11px 16px;
  border-radius: 6px;
  outline-color: #4a90e2;
  width: 100%;
}

.DayPickerInput input::placeholder {
  font-size: 18px;
  color: #4B5563;
}

.DayPicker-Day--selected {
  background-color: #F01159 !important;
    color: #FFFFFF !important;
}

.DayPicker-Day--today {
  // background-color: #F3F4F6 !important;
    color: #F01159 !important;
}
`;
