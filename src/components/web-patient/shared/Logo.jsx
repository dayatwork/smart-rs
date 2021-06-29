import * as React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text } from '@chakra-ui/react';
// import { FaHospitalSymbol } from 'react-icons/fa';
// import LogoSvg from './Logo.svg';

// export const Logo = (props) => {
//   const { iconColor = 'currentColor', ...rest } = props;
//   const color = useToken('colors', iconColor);
//   return <Icon as={FaHospitalSymbol} fill={color} {...rest} />;
// };

export const Logo = ({ mini, mobile, light, ...rest }) => {
  return (
    // <Box
    //   px="4"
    //   py="2"
    //   // h="16"
    //   display="flex"
    //   alignItems="center"
    //   bgColor="purple.600"
    //   {...rest}
    // >
    <Link to="/">
      <Flex
        bg={light ? 'white' : 'blue.600'}
        h="16"
        px="4"
        align="center"
        mr={mini || mobile ? null : '10'}
        {...rest}
      >
        {/* <Icon
          as={FaHospitalSymbol}
          w="10"
          h="10"
          fill={light ? 'blue.600' : 'white'}
          mr={mini ? null : '3'}
        /> */}
        {/* <Image src={LogoSvg} alt="logo" w="12" mr={mini ? null : '3'} /> */}
        <LogoRS
          w={mini ? '14' : '16'}
          // bg={mini ? 'white' : null}
          // border={mini ? '1px' : null}
          // borderColor={mini ? 'white' : null}
          // rounded={mini ? 'full' : null}
          mr={mini ? null : '1'}
        />
        {mini ? null : (
          <Box>
            <Text
              fontSize="lg"
              color={light ? 'blue.600' : 'white'}
              fontWeight="bold"
            >
              SMART-RS
            </Text>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={light ? 'blue.600' : 'white'}
              mt="-1.5"
            >
              Web Patient
            </Text>
          </Box>
        )}
      </Flex>
    </Link>
  );
};

const LogoRS = ({ w = '28', ...rest }) => {
  return (
    <Box w={w} {...rest}>
      <svg
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <linearGradient
          id="a"
          x1="54.326"
          x2="451.453"
          y1="251.387"
          y2="251.387"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0071bc"></stop>
          <stop offset="0.284" stopColor="#0374bf"></stop>
          <stop offset="0.519" stopColor="#0e7dc8"></stop>
          <stop offset="0.737" stopColor="#1f8cd8"></stop>
          <stop offset="0.943" stopColor="#37a2ee"></stop>
          <stop offset="1" stopColor="#3fa9f5"></stop>
        </linearGradient>
        <circle
          cx="252.89"
          cy="251.388"
          r="198.563"
          fill="url(#a)"
          stroke="#FFF"
          strokeMiterlimit="10"
          strokeWidth="3"
        ></circle>
        <circle
          cx="252.89"
          cy="251.388"
          r="198.563"
          fill="none"
          stroke="#F01159"
          strokeMiterlimit="10"
          strokeWidth="4"
        ></circle>
        <circle cx="254.308" cy="66.111" r="51.712" fill="#FFF"></circle>
        <path
          fill="#FFF"
          d="M306.02 427.994c0 28.563-23.151 51.712-51.712 51.712s-51.712-23.149-51.712-51.712c0-28.561 23.151-51.711 51.712-51.711s51.712 23.151 51.712 51.711z"
        ></path>
        <circle cx="408.109" cy="162.614" r="51.711" fill="#FFF"></circle>
        <circle cx="408.109" cy="352.603" r="51.711" fill="#FFF"></circle>
        <circle cx="88.445" cy="162.614" r="51.712" fill="#FFF"></circle>
        <circle cx="88.445" cy="352.603" r="51.712" fill="#FFF"></circle>
        <path fill="none" d="M40 321h105v128H40z"></path>
        <path
          fill="none"
          stroke="#F01159"
          strokeMiterlimit="10"
          strokeWidth="4"
          d="M130.055 351.115c0 23.207-18.813 42.02-42.02 42.02-23.204 0-42.019-18.813-42.019-42.02S64.832 309.1 88.035 309.1c23.207 0 42.02 18.808 42.02 42.015zm165.816 77.395c0 23.204-18.813 42.018-42.019 42.018-23.204 0-42.017-18.813-42.017-42.018 0-23.21 18.813-42.021 42.017-42.021 23.206-.001 42.019 18.811 42.019 42.021z"
        ></path>
        <circle
          cx="407.337"
          cy="162.604"
          r="42.02"
          fill="none"
          stroke="#F01159"
          strokeMiterlimit="10"
          strokeWidth="4"
        ></circle>
        <circle
          cx="253.853"
          cy="65.34"
          r="42.018"
          fill="none"
          stroke="#F01159"
          strokeMiterlimit="10"
          strokeWidth="4"
        ></circle>
        <path
          fill="#0C6D96"
          d="M266.31 40.996H241.4a2.723 2.723 0 00-2.725 2.724v43.239a2.724 2.724 0 002.725 2.725h24.909a2.722 2.722 0 002.718-2.725V43.72a2.721 2.721 0 00-2.717-2.724zm-8.853 46.505h-7.213a.885.885 0 010-1.77h7.213a.885.885 0 110 1.77zm6.502-6.111h-20.212V45.44h20.212v35.95zm1.952 2.032h-24.117V43.696h24.117v39.726z"
        ></path>
        <circle
          cx="88.037"
          cy="162.604"
          r="42.018"
          fill="none"
          stroke="#F01159"
          strokeMiterlimit="10"
          strokeWidth="4"
        ></circle>
        <circle
          cx="407.336"
          cy="351.115"
          r="42.016"
          fill="none"
          stroke="#F01159"
          strokeMiterlimit="10"
          strokeWidth="4"
        ></circle>
        <circle
          cx="254.919"
          cy="247.629"
          r="89.138"
          fill="#0C6D96"
          stroke="#FFF"
          strokeMiterlimit="10"
          strokeWidth="3"
        ></circle>
        <path
          fill="#F01159"
          stroke="#FFF"
          strokeMiterlimit="10"
          d="M316.26 229.5H273.5v-39.277c0-7.744 1.933-16.723-6.084-16.723h-26.785c-7.5 1-7.131 8.979-7.131 16.723V229.5h-34.058c-8.024 0-16.942.057-16.942 7.799v23.266c0 7.742 8.918 6.935 16.942 6.935H233.5v35.563c0 7.742-.881 15.438 7.131 15.438h26.785c7.181 0 6.084-7.695 6.084-15.438V267.5h42.76c8.025 0 11.24.808 11.24-6.935v-23.266c0-7.742-3.215-7.799-11.24-7.799z"
        ></path>
        <path
          fill="#FFF"
          d="M200.176 262.252c-1.226-1.361-1.838-3.311-1.838-5.852v-1.794H203v2.153c0 2.032.851 3.048 2.556 3.048.836 0 1.47-.247 1.903-.739.433-.495.65-1.293.65-2.396 0-1.317-.297-2.475-.895-3.477-.598-1-1.705-2.201-3.32-3.606-2.033-1.794-3.451-3.417-4.258-4.866-.807-1.449-1.21-3.086-1.21-4.909 0-2.48.626-4.4 1.885-5.761 1.254-1.358 3.077-2.037 5.468-2.037 2.36 0 4.146.679 5.356 2.037 1.212 1.361 1.815 3.311 1.815 5.852v1.299h-4.663v-1.614c0-1.075-.208-1.861-.628-2.353-.418-.492-1.03-.739-1.836-.739-1.645 0-2.466 1.002-2.466 3.004 0 1.133.306 2.197.919 3.181.613.987 1.726 2.182 3.339 3.586 2.061 1.794 3.481 3.422 4.258 4.886.779 1.467 1.167 3.184 1.167 5.156 0 2.571-.635 4.542-1.906 5.916-1.272 1.376-3.114 2.063-5.536 2.063-2.39.001-4.197-.677-5.422-2.038zm42.273-29.789h7.038l3.137 22.459h.09l3.137-22.459h7.039v31.38h-4.663v-23.758h-.089l-3.586 23.758h-4.123l-3.586-23.758h-.092v23.758h-4.302v-31.38zm54.61 0h6.678l5.111 31.38h-4.932l-.897-6.232v.093h-5.601l-.898 6.14h-4.572l5.111-31.381zm5.38 20.98l-2.197-15.51h-.092l-2.15 15.51h4.439zm-56.963-68.6h7.306c2.542 0 4.394.591 5.561 1.77 1.163 1.182 1.746 2.998 1.746 5.449v1.927c0 3.256-1.075 5.317-3.228 6.187v.089c1.197.359 2.042 1.093 2.534 2.197.495 1.107.742 2.584.742 4.438v5.514c0 .898.028 1.622.088 2.173.059.554.209 1.099.448 1.637h-5.022a7.04 7.04 0 01-.356-1.434c-.062-.448-.092-1.255-.092-2.422v-5.737c0-1.437-.232-2.435-.694-3.002-.463-.569-1.263-.851-2.397-.851h-1.705v13.446h-4.93v-31.381zm6.724 13.448c.987 0 1.725-.253 2.22-.759.492-.51.739-1.361.739-2.558v-2.42c0-1.136-.202-1.956-.606-2.465-.403-.509-1.037-.762-1.903-.762h-2.244v8.964h1.794zm-1.995 83.91h-5.153v-4.481h15.24v4.481h-5.153V309.1h-4.934v-26.899z"
        ></path>
        <path
          fill="#18749B"
          fillRule="evenodd"
          d="M78.752 153.567l-6.306 31.888c-1.569-1.722-1.488-3.842-2.009-5.719-1.003-3.612-2-7.229-2.837-10.882-.612-2.67-1.375-4.861-4.851-4.078-1.186.267-1.75-.321-1.701-1.623.048-1.245.8-1.2 1.69-1.308 5.434-.657 5.865-.375 7.305 4.982.493 1.832 1.026 3.652 1.77 6.292 2.194-11.102 4.23-21.409 6.268-31.716l.563-.142c1.606 6.009 3.193 12.023 4.826 18.025.814 2.992 2.191 3.429 4.808 1.604.297-.207.557-.472.864-.66 1.742-1.063 3.301-.63 4.552.79 1.298 1.474 1.3 3.141-.002 4.616-1.252 1.418-2.819 1.879-4.545.782-.699-.445-1.413-1.552-1.958-1.455-6.949 1.248-6.293-4.306-7.486-8.208-.246-.801-.481-1.607-.951-3.188z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#1B769C"
          fillRule="evenodd"
          d="M116.476 163.227c-.043 12.66-9.248 23.101-21.616 24.713-1.047.137-2.808 1.181-3.164-1.038-.367-2.287 1.501-1.652 2.643-1.858 10.572-1.911 17.921-9.423 19.108-19.563 1.057-9.035-4.498-18.454-13.245-22.17-1.979-.841-4.153-1.28-6.277-1.704-1.203-.239-2.543.001-2.246-1.895.321-2.05 1.9-1.135 2.867-1.039 10.025.997 18.922 8.922 21.195 18.777.464 2.008.916 4.023.735 5.777z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#1B769C"
          fillRule="evenodd"
          d="M109.916 163.508c-.055 8.89-6.713 16.625-15.496 17.878-.969.138-2.511 1.02-2.755-1.108-.229-2.004 1.289-1.576 2.362-1.825 7.957-1.847 13.011-7.827 12.933-15.293-.076-7.305-5.123-13.187-12.914-14.928-1.307-.292-2.891-.145-2.315-2.175.51-1.799 2.016-.903 3.02-.724 8.874 1.584 15.22 9.243 15.165 18.175z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#1B769C"
          fillRule="evenodd"
          d="M102.626 163.483c-.062 5.068-3.171 9.179-8.007 10.423-.999.257-2.405 1.247-2.919-.683-.458-1.72.849-1.792 2.026-2.203 5.967-2.082 7.878-8.71 3.855-13.053-1.21-1.306-2.747-2.054-4.404-2.384-1.502-.299-1.738-1.161-1.446-2.322.372-1.477 1.526-.79 2.355-.605 4.964 1.105 8.602 5.754 8.54 10.827z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#0C6D96"
          fillRule="evenodd"
          d="M68.374 375.187c-.928-2.129-.548-4.36-.296-6.512.159-1.361 1.359-2.041 2.812-2.04 9.408.006 18.817.006 28.225 0 1.452-.001 2.651.678 2.813 2.04.255 2.151.634 4.383-.294 6.512h-33.26z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#137198"
          fillRule="evenodd"
          d="M64.097 336.7c.698-.382.719-1.176 1.06-1.771 1.934-3.384 5.857-5.112 9.508-4.157 3.9 1.02 6.534 4.364 6.535 8.3.001 3.94-2.618 7.265-6.534 8.294-3.664.962-7.557-.749-9.507-4.145-.342-.595-.363-1.39-1.063-1.77l.001-4.751zm12.897 2.355c-.01-2.484-1.877-4.335-4.365-4.325-2.483.011-4.336 1.88-4.326 4.364.01 2.483 1.88 4.336 4.366 4.326 2.478-.009 4.334-1.883 4.325-4.365zm14.985 25.666c-4.692 0-8.878-.025-13.063.02-.915.01-1.431-.307-1.847-1.104-2.479-4.752-4.997-9.483-7.653-14.509 4.341.938 7.975.079 10.905-3.027.527-.56.885-.5 1.233.138.151.276.324.542.479.816l9.946 17.666zm-2.229-25.656v-1.896c.003-4.264 2.396-6.105 6.449-4.507 1.64.646 2.278.222 2.926-.941 1.155-2.073 2.48-2.365 4.517-1.004 2.155 1.441 4.549 2.523 6.822 3.794.588.329 1.464.646.996 1.565-.475.933-1.217.406-1.823.08-2.293-1.233-4.596-2.45-6.845-3.76-.928-.541-1.386-.337-2.179.374-3.232 2.898-3.288 9.645-.077 12.552.868.785 1.367.999 2.371.402 2.17-1.288 4.4-2.475 6.623-3.674.597-.322 1.334-.866 1.854.016.543.92-.341 1.25-.924 1.575-2.688 1.499-5.431 2.898-8.082 4.459-1.406.828-1.988-.021-2.672-.938-.995-1.334-1.591-2.438-3.999-1.628-4.165 1.4-5.956-.371-5.957-4.81v-1.659zm-7.72 5.539c1.11-3.363 1.718-6.746-.12-10.099 5.895-.604 5.895-.604 5.895 4.704v.474c.001 5.532.001 5.532-5.775 4.921z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#0C6D96"
          fillRule="evenodd"
          d="M380.829 362.174v-6.38c1.116-2.579 2.65-4.817 5.169-6.22.918-.512 1.325-1.307 1.702-2.253 1.708-4.285 4.991-6.034 9.513-5.02 1.293.288 2.096.084 2.939-1.012 3.751-4.889 8.754-6.899 14.766-5.498 6.134 1.438 9.688 5.545 10.837 11.736.232 1.243.526 2.383 1.959 2.896 3.128 1.106 5.106 3.398 6.3 6.431v5.852c-2.321 4.886-6.123 6.813-11.563 6.665a509.475 509.475 0 00-28.938 0c-5.905.177-10.128-1.85-12.684-7.197z"
          clipRule="evenodd"
        ></path>
        <path
          fill="none"
          d="M434.014 356.854c-1.193-3.032-3.172-5.324-6.3-6.431-1.433-.513-1.727-1.652-1.959-2.896-1.148-6.191-4.703-10.299-10.837-11.736-6.012-1.401-11.015.609-14.766 5.498-.844 1.096-1.646 1.3-2.939 1.012-4.521-1.015-7.805.734-9.513 5.02-.377.946-.784 1.741-1.702 2.253-2.519 1.402-4.053 3.641-5.169 6.22 0-9.11.026-18.217-.029-27.326-.009-1.393.035-1.996 1.817-1.987 16.536.103 33.072.105 49.608 0 1.788-.009 1.822.606 1.813 1.99-.052 9.463-.024 18.925-.024 28.383zm-53.185 5.32c2.556 5.348 6.779 7.374 12.684 7.197a509.475 509.475 0 0128.938 0c5.44.148 9.242-1.779 11.563-6.665 0 5.23-.044 10.462.031 15.688.019 1.146-.22 1.367-1.362 1.364a9052.772 9052.772 0 00-50.526 0c-1.142.003-1.381-.219-1.362-1.364.076-5.403.034-10.814.034-16.22z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#0C6D96"
          fillRule="evenodd"
          d="M253.954 425.646c0-6.737-.006-13.475.003-20.211.004-2.944.302-3.214 3.302-3.132 9.039.248 17.412 7.061 19.869 16.424 1.209 4.609 2.06 9.313 3.028 13.983.344 1.66.12 3.25-1.221 4.454-.981.881-1.254 1.947-1.21 3.21.054 1.542.061 3.09-.015 4.63-.135 2.742-1.965 4.515-4.726 4.653-.7.035-1.403.006-2.104.021-2.997.065-3.811.813-4.098 3.814-.091.959-.204 1.963-1.436 1.914-1.238-.05-1.249-1.104-1.295-2.037-.198-3.997 2.014-6.36 6.018-6.422.562-.009 1.123.006 1.685-.009 2.49-.067 3.182-.774 3.237-3.334.021-.981.051-1.967-.003-2.946-.11-2.033.118-3.92 1.786-5.369.719-.624.669-1.45.477-2.333-.952-4.386-1.674-8.832-2.831-13.163-2.042-7.638-6.983-12.489-14.758-14.263-2.842-.647-2.979-.472-2.979 2.403-.002 12.702.012 25.404-.023 38.107-.003 1.147.534 2.974-1.33 2.988-1.881.016-1.345-1.815-1.353-2.963-.046-6.804-.023-13.612-.023-20.419zm-9.658 4.646c-1.123 0-2.249.052-3.368-.012-1.803-.101-3.287.101-4.594 1.743-1.456 1.829-4.392 1.603-6.024-.071-1.639-1.679-1.622-4.427.036-6.086 1.656-1.657 4.564-1.84 6.021.011 1.253 1.593 2.677 1.735 4.405 1.702 2.876-.056 5.754-.02 8.632-.004.935.005 2.008.052 2.052 1.275.05 1.387-1.102 1.416-2.107 1.43-1.684.021-3.369.006-5.053.006v.006zm-6.409 7.452c1.265.518 2.182-.346 2.862-1.325 2.51-3.617 6.196-2.42 9.579-2.424.681-.001 1.15.523 1.155 1.263.004.741-.452 1.199-1.147 1.271-.97.1-1.96.169-2.93.093-1.869-.146-3.314.419-4.683 1.783-1.135 1.131-1.334 2.245-1.271 3.727.09 2.112-1.458 3.791-3.457 4.115-2.172.353-4.169-.781-4.862-2.763-.68-1.944.055-4.069 1.774-5.146.868-.543 1.817-.699 2.98-.594zm8.661-13.748c-2.282.634-4.272-.581-5.892-2.668-.796-1.026-1.757-1.325-3.098-1.218-2.742.22-4.658-1.627-4.663-4.212-.005-2.517 1.903-4.379 4.416-4.31 2.554.071 4.256 2.028 4.156 4.779-.086 2.366 2.204 4.808 4.603 4.881 1.049.031 2.101-.008 3.151.019.981.023 2.197-.044 2.227 1.305.033 1.524-1.288 1.37-2.319 1.418-.7.032-1.401.006-2.581.006zm1.69-18.32c2.429.04 4.223 1.882 4.209 4.321-.015 2.518-1.946 4.354-4.479 4.261-2.417-.089-4.168-1.979-4.104-4.426.065-2.423 1.93-4.195 4.374-4.156zm.091 37.92c2.417.083 4.176 1.968 4.118 4.412-.06 2.504-2.037 4.306-4.57 4.166-2.405-.133-4.119-2.063-4.009-4.513.107-2.411 2.014-4.149 4.461-4.065zm159.037-251.844c-3.16-1.207-4.076-2.74-3.545-6.066-4.637-2.68-9.301-5.375-13.647-7.89-1.467.495-2.659 1.148-3.899 1.257-2.15.191-3.97-1.418-4.356-3.487-.391-2.125.799-4.213 2.799-5.031.367-.148.877-.575.88-.876.053-5.195.041-10.389.041-15.637-2.231-.638-3.687-1.949-3.757-4.37-.06-1.835.768-3.246 2.411-4.026 2.038-.969 3.879-.458 5.481 1.112 4.512-2.602 9.005-5.188 13.488-7.797.241-.139.57-.505.529-.694-.644-2.938.774-4.635 3.323-5.686h1.752c2.965 1.231 3.519 2.122 3.53 5.486 0 .314.301.751.583.917 4.448 2.597 8.914 5.162 13.45 7.774 1.139-1.088 2.459-1.769 4.108-1.535 2.021.288 3.563 1.79 3.8 3.731.255 2.108-.85 4.106-2.825 4.738-.834.267-.978.643-.975 1.4.026 4.744 0 9.488.041 14.232.003.389.285 1.011.585 1.124 1.968.729 3.105 2.047 3.19 4.156.071 1.895-.805 3.324-2.503 4.103-1.891.868-3.646.477-5.162-.959-.06-.056-.139-.092-.263-.169-4.503 2.603-9.035 5.212-13.547 7.854-.251.146-.489.555-.489.844-.024 3.369-.573 4.248-3.524 5.494l-1.499.001zm18.327-40.586c-.05-.539-.221-1.025-.108-1.432.411-1.486-.345-2.206-1.582-2.685-.156-.059-.285-.173-.433-.256l-11.897-6.872c-.808.471-1.52.81-2.142 1.273-.324.24-.678.689-.687 1.05-.056 2.537-.064 5.07.003 7.604.009.425.354 1.006.715 1.229a203.462 203.462 0 007.426 4.31c.362.199 1.033.162 1.408-.044 2.435-1.336 4.827-2.751 7.297-4.177zM390.56 172.9v3.423c4.509 2.609 9.062 5.25 13.627 7.863.188.107.553.066.759-.047.78-.435 1.535-.926 2.38-1.444 0-2.698.019-5.48-.031-8.262-.003-.318-.31-.753-.6-.925a375.647 375.647 0 00-7.956-4.625c-.295-.163-.822-.202-1.099-.046-2.424 1.35-4.816 2.755-7.08 4.063zm21.106 11.506c4.041-2.34 8.185-4.786 12.387-7.133 1.102-.614 1.9-1.156 1.532-2.595-.124-.484.076-1.052.136-1.613-2.416-1.393-4.813-2.797-7.24-4.146-.288-.157-.814-.155-1.099.003a348.317 348.317 0 00-7.962 4.623c-.288.172-.572.622-.578.948-.047 2.778-.025 5.562-.025 8.227.986.583 1.866 1.102 2.849 1.686zm14.801-31.95c-2.511 1.453-5.003 2.868-7.455 4.343-.31.184-.587.694-.593 1.058-.05 2.826-.05 5.657 0 8.484.006.373.269.901.575 1.083 2.484 1.491 5.012 2.916 7.463 4.326.635-.4 1.154-.884 1.761-1.065.866-.256 1.01-.747 1.003-1.55-.031-4.284-.05-8.569.003-12.853.019-1.376.08-2.618-1.643-3.02-.371-.086-.669-.472-1.114-.806zm-36.865 19.251c2.425-1.396 4.813-2.737 7.156-4.149.343-.205.666-.754.672-1.151.053-2.951.039-5.904.012-8.857-.003-.327-.139-.806-.38-.957-2.38-1.486-4.794-2.92-7.047-4.276-.831.536-1.438 1.108-2.156 1.34-.776.251-.9.655-.897 1.357.022 4.323.041 8.649-.006 12.975-.016 1.365-.121 2.645 1.652 3.007.331.065.606.42.994.711zm14.864-31.751c-3.938 2.274-7.854 4.616-11.854 6.798-1.436.783-2.444 1.58-1.946 3.339.127.445.348.998.705 1.226a152.428 152.428 0 006.375 3.867c.347.196.975.231 1.318.051 2.562-1.361 5.09-2.786 7.611-4.222.276-.16.616-.525.619-.8.043-2.935.025-5.871.025-8.607l-2.853-1.652zm2.897 32.327c0-2.641-.112-5.05.042-7.445.103-1.613-.377-2.545-1.853-3.291-2.232-1.132-4.339-2.52-6.675-3.904 0 3.176-.017 6.116.03 9.055.006.335.315.796.619.98 2.52 1.519 5.067 2.988 7.837 4.605zm1.447-.008c1.938-1.133 3.605-2.334 5.443-3.134 2.314-1.005 3.139-2.503 2.844-4.995-.238-2.025-.047-4.101-.047-6.39-2.763 1.646-5.29 3.143-7.801 4.67-.207.125-.416.444-.416.676-.032 2.981-.023 5.962-.023 9.173zm-8.785-15.662c2.6 1.565 5.047 3.051 7.513 4.507.244.145.679.248.883.125 2.48-1.469 4.938-2.984 7.504-4.549-2.727-1.697-5.301-3.294-7.885-4.898-2.664 1.601-5.288 3.178-8.015 4.815zm5.11-19.663c-.024 1.598 1.274 2.952 2.868 2.991 1.566.041 2.957-1.302 2.989-2.882.031-1.58-1.3-2.955-2.884-2.983-1.596-.03-2.956 1.287-2.973 2.874zm-15.96 12.674c.021-1.626-1.236-2.953-2.842-2.998-1.572-.044-2.939 1.284-2.959 2.875-.024 1.619 1.242 2.959 2.842 3.009 1.562.049 2.939-1.293 2.959-2.886zm15.953 37.661c-.009 1.596 1.303 2.935 2.896 2.955 1.572.02 2.953-1.323 2.972-2.894.018-1.584-1.309-2.923-2.909-2.944-1.604-.022-2.946 1.291-2.959 2.883zm27.728-37.717c.003-1.6-1.312-2.937-2.899-2.944-1.587-.008-2.906 1.326-2.902 2.933.003 1.618 1.299 2.941 2.894 2.953 1.571.012 2.905-1.338 2.907-2.942zm-43.681 25.1a2.906 2.906 0 00-2.978-2.876c-1.619.045-2.868 1.382-2.823 3.03.038 1.552 1.359 2.832 2.909 2.821 1.616-.008 2.909-1.345 2.892-2.975zm43.681.055c0-1.642-1.29-2.937-2.925-2.932a2.91 2.91 0 00-2.881 2.854 2.92 2.92 0 002.863 2.997c1.603.031 2.943-1.3 2.943-2.919z"
          clipRule="evenodd"
        ></path>
      </svg>
    </Box>
  );
};
