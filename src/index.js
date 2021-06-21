import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import App from './App';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <App />
          </ChakraProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </CookiesProvider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
