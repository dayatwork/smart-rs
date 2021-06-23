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
  ApplicationPage,
  MenuPage,
  RoutePage,
  EventNodePage,
  AllergiesPage,
  FamilyHistoryPage,
  MedicalHistoryPage,
  SymptomPage,
  SocialHistoryPage,
  SoapObjectivePage,
  ICD10Page,
  ICD9Page,
  LaboratoryCategoryPage,
  RadiologyCategoryPage,
  ProfessionPage,
  ServicePage,
  PaymentMethodPage,
  PatientTypePage,
} from './sub-page';
import { SuperAdminRoute } from '../../../access-control';

export const MasterPage = () => {
  const { path } = useRouteMatch();

  return (
    <AppShell>
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <SubMenuSideBar
            title="Master"
            titleLink="/master"
            subMenus={subMenus}
          />
          <ContentWrapper>
            <Switch>
              <SuperAdminRoute exact path={path}>
                <SubMenuGrid title="Master" subMenus={subMenus} />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/application`}>
                <ApplicationPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/menu`}>
                <MenuPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/route`}>
                <RoutePage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/event-node`}>
                <EventNodePage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/allergies`}>
                <AllergiesPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/family-history`}>
                <FamilyHistoryPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/medical-history`}>
                <MedicalHistoryPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/symptom`}>
                <SymptomPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/social-history`}>
                <SocialHistoryPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/soap-objective`}>
                <SoapObjectivePage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/icd-10`}>
                <ICD10Page />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/icd-9`}>
                <ICD9Page />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/laboratory-category`}>
                <LaboratoryCategoryPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/radiology-category`}>
                <RadiologyCategoryPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/profession`}>
                <ProfessionPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/service`}>
                <ServicePage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/payment-method`}>
                <PaymentMethodPage />
              </SuperAdminRoute>
              <SuperAdminRoute exact path={`${path}/patient-type`}>
                <PatientTypePage />
              </SuperAdminRoute>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
