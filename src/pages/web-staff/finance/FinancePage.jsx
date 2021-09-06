import React, { useContext } from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

import { AppShell } from '../../../components/web-staff/shared/app-shell';
import {
  SubMenuGrid,
  SubMenuSideBar,
  ContentWrapper,
} from '../../../components/web-staff/shared/sub-menu';
import { subMenus } from './subMenus';
import { IncomePage } from './sub-page';
import { PaymentMethodPage } from '../institution-management/sub-page/PaymentMethodPage';
import { PaymentList, PaymentDetails } from '../event-node/sub-page/payment';
import { PrivateRoute, Permissions } from '../../../access-control';
import { AuthContext } from '../../../contexts/authContext';

const FinancePage = () => {
  const { path } = useRouteMatch();
  const { permissions, user } = useContext(AuthContext);

  const showedSubMenus = subMenus
    .map(menu => {
      if (menu.permission) {
        if (permissions.includes(menu.permission)) {
          return menu;
        }
        return false;
      }
      return menu;
    })
    .filter(menu => !!menu);

  return (
    <AppShell>
      <Box height="full" overflow="hidden" position="relative" w="full">
        <Flex h="full">
          <SubMenuSideBar
            title="Finance"
            titleLink="/finance"
            subMenus={
              user?.role?.alias === 'super-admin' ? subMenus : showedSubMenus
            }
          />
          <ContentWrapper>
            <Switch>
              <PrivateRoute
                permission={Permissions.dashboardFinance}
                exact
                path={path}
                pageTitle="Finance | SMART-RS"
              >
                <SubMenuGrid
                  title="Finance"
                  subMenus={
                    user?.role?.alias === 'super-admin'
                      ? subMenus
                      : showedSubMenus
                  }
                />
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
              <PrivateRoute
                permission={Permissions.indexPayment}
                exact
                path={`${path}/income`}
                pageTitle="Income | SMART-RS"
              >
                <IncomePage />
              </PrivateRoute>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};

export default FinancePage;
