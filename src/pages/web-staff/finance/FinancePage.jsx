import React from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

import { AppShell } from '../../../components/web-staff/shared/app-shell';
import {
  SubMenuGrid,
  SubMenuSideBar,
  ContentWrapper,
} from '../../../components/web-staff/shared/sub-menu';
import { subMenus } from './subMenus';
import { PaymentMethodPage } from '../institution-management/sub-page/PaymentMethodPage';
import { PaymentList, PaymentDetails } from '../event-node/sub-page/payment';
import { PrivateRoute, Permissions } from '../../../access-control';

export const FinancePage = () => {
  const { path } = useRouteMatch();

  return (
    <AppShell>
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <SubMenuSideBar
            title="Finance"
            titleLink="/finance"
            subMenus={subMenus}
          />
          <ContentWrapper>
            <Switch>
              <PrivateRoute
                permission={Permissions.dashboardFinance}
                exact
                path={path}
                pageTitle="Finance | SMART-RS"
              >
                <SubMenuGrid title="Finance" subMenus={subMenus} />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionPaymentMethod}
                exact
                path={`${path}/payment-method`}
                pageTitle="Payment Method | SMART-RS"
              >
                <PaymentMethodPage fromFinanceMenu />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexPayment}
                exact
                path={`${path}/patient-payment`}
                pageTitle="Payment | SMART-RS"
              >
                <PaymentList fromFinanceMenu />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailPayment']}
                exact
                path={`${path}/patient-payment/:id`}
                pageTitle="Detail Payment | SMART-RS"
              >
                <PaymentDetails fromFinanceMenu />
              </PrivateRoute>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
