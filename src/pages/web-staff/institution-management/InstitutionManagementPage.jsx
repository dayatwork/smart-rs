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
import {
  InstitutionPage,
  DepartmentPage,
  DivisionPage,
  ServicePage,
  EventNodePage,
  FMSPage,
  AccountPage,
  RolePage,
  LabCategoryPage,
  RadiologyCategoryPage,
  PaymentMethodPage,
} from './sub-page';

export const InstitutionManagementPage = () => {
  const { path } = useRouteMatch();

  return (
    <AppShell>
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <SubMenuSideBar
            title="Institution Management"
            titleLink="/institution-management"
            subMenus={subMenus}
          />
          <ContentWrapper>
            <Switch>
              <Route exact path={path}>
                <SubMenuGrid title="Institution Management" subMenus={subMenus} />
              </Route>
              <Route exact path={`${path}/institution`}>
                <InstitutionPage />
              </Route>
              <Route exact path={`${path}/department`}>
                <DepartmentPage />
              </Route>
              <Route exact path={`${path}/division`}>
                <DivisionPage />
              </Route>
              <Route exact path={`${path}/service`}>
                <ServicePage />
              </Route>
              <Route exact path={`${path}/event`}>
                <EventNodePage />
              </Route>
              <Route exact path={`${path}/fms`}>
                <FMSPage />
              </Route>
              <Route exact path={`${path}/account`}>
                <AccountPage />
              </Route>
              <Route exact path={`${path}/role`}>
                <RolePage />
              </Route>
              <Route exact path={`${path}/lab-category`}>
                <LabCategoryPage />
              </Route>
              <Route exact path={`${path}/radiology-category`}>
                <RadiologyCategoryPage />
              </Route>
              <Route exact path={`${path}/payment-method`}>
                <PaymentMethodPage />
              </Route>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
