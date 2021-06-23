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
import { PrivateRoute, Permissions } from '../../../access-control';

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
              <PrivateRoute
                permission={Permissions.dashboardInstitutionManagement}
                exact
                path={path}
              >
                <SubMenuGrid
                  title="Institution Management"
                  subMenus={subMenus}
                />
              </PrivateRoute>
              <Route exact path={`${path}/institution`}>
                <InstitutionPage />
              </Route>
              <PrivateRoute
                permission={Permissions.indexInstitutionDepartment}
                exact
                path={`${path}/department`}
              >
                <DepartmentPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionDivision}
                exact
                path={`${path}/division`}
              >
                <DivisionPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionService}
                exact
                path={`${path}/service`}
              >
                <ServicePage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionEventNode}
                exact
                path={`${path}/event`}
              >
                <EventNodePage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexMedicalStaffFunctional}
                exact
                path={`${path}/fms`}
              >
                <FMSPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionUser}
                exact
                path={`${path}/account`}
              >
                <AccountPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionRole}
                exact
                path={`${path}/role`}
              >
                <RolePage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionLaboratory}
                exact
                path={`${path}/lab-category`}
              >
                <LabCategoryPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionRadiology}
                exact
                path={`${path}/radiology-category`}
              >
                <RadiologyCategoryPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionPaymentMethod}
                exact
                path={`${path}/payment-method`}
              >
                <PaymentMethodPage />
              </PrivateRoute>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
