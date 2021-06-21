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

export const MasterPage = () => {
  const { path } = useRouteMatch();

  return (
    <AppShell>
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <SubMenuSideBar title="Master" titleLink="/master" subMenus={subMenus} />
          <ContentWrapper>
            <Switch>
              <Route exact path={path}>
                <SubMenuGrid title="Master" subMenus={subMenus} />
              </Route>
              <Route exact path={`${path}/application`}>
                <ApplicationPage />
              </Route>
              <Route exact path={`${path}/menu`}>
                <MenuPage />
              </Route>
              <Route exact path={`${path}/route`}>
                <RoutePage />
              </Route>
              <Route exact path={`${path}/event-node`}>
                <EventNodePage />
              </Route>
              <Route exact path={`${path}/allergies`}>
                <AllergiesPage />
              </Route>
              <Route exact path={`${path}/family-history`}>
                <FamilyHistoryPage />
              </Route>
              <Route exact path={`${path}/medical-history`}>
                <MedicalHistoryPage />
              </Route>
              <Route exact path={`${path}/symptom`}>
                <SymptomPage />
              </Route>
              <Route exact path={`${path}/social-history`}>
                <SocialHistoryPage />
              </Route>
              <Route exact path={`${path}/soap-objective`}>
                <SoapObjectivePage />
              </Route>
              <Route exact path={`${path}/icd-10`}>
                <ICD10Page />
              </Route>
              <Route exact path={`${path}/icd-9`}>
                <ICD9Page />
              </Route>
              <Route exact path={`${path}/laboratory-category`}>
                <LaboratoryCategoryPage />
              </Route>
              <Route exact path={`${path}/radiology-category`}>
                <RadiologyCategoryPage />
              </Route>
              <Route exact path={`${path}/profession`}>
                <ProfessionPage />
              </Route>
              <Route exact path={`${path}/service`}>
                <ServicePage />
              </Route>
              <Route exact path={`${path}/payment-method`}>
                <PaymentMethodPage />
              </Route>
              <Route exact path={`${path}/patient-type`}>
                <PatientTypePage />
              </Route>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
