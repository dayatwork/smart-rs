import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
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
              <Route exact path={path}>
                <SubMenuGrid title="Finance" subMenus={subMenus} />
              </Route>
              <Route exact path={`${path}/payment-method`}>
                <PaymentMethodPage fromFinanceMenu />
              </Route>
              <Route exact path={`${path}/patient-payment`}>
                <PaymentList fromFinanceMenu />
              </Route>
              <Route exact path={`${path}/patient-payment/:id`}>
                <PaymentDetails fromFinanceMenu />
              </Route>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
