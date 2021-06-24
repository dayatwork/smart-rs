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
import {
  PrivateRoute,
  Permissions,
  SuperAdminRoute,
} from '../../../access-control';

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
                pageTitle="Institution Management | SMART-RS"
              >
                <SubMenuGrid
                  title="Institution Management"
                  subMenus={subMenus}
                />
              </PrivateRoute>
              <SuperAdminRoute exact path={`${path}/institution`}>
                <InstitutionPage />
              </SuperAdminRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionDepartment}
                exact
                path={`${path}/department`}
                pageTitle="Department | Institution Management | SMART-RS"
              >
                <DepartmentPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionDivision}
                exact
                path={`${path}/division`}
                pageTitle="Division | Institution Management | SMART-RS"
              >
                <DivisionPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionService}
                exact
                path={`${path}/service`}
                pageTitle="Service | Institution Management | SMART-RS"
              >
                <ServicePage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionEventNode}
                exact
                path={`${path}/event`}
                pageTitle="Event Node | Institution Management | SMART-RS"
              >
                <EventNodePage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexMedicalStaffFunctional}
                exact
                path={`${path}/fms`}
                pageTitle="FMS | Institution Management | SMART-RS"
              >
                <FMSPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionUser}
                exact
                path={`${path}/account`}
                pageTitle="Account | Institution Management | SMART-RS"
              >
                <AccountPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionRole}
                exact
                path={`${path}/role`}
                pageTitle="Role | Institution Management | SMART-RS"
              >
                <RolePage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionLaboratory}
                exact
                path={`${path}/lab-category`}
                pageTitle="Lab Category | Institution Management | SMART-RS"
              >
                <LabCategoryPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionRadiology}
                exact
                path={`${path}/radiology-category`}
                pageTitle="Radiology Category | Institution Management | SMART-RS"
              >
                <RadiologyCategoryPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexInstitutionPaymentMethod}
                exact
                path={`${path}/payment-method`}
                pageTitle="Payment Method | Institution Management | SMART-RS"
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
