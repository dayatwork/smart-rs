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
  RegisteredPatientList,
  CreateRegistration,
  BookedPatientList,
  CreateBooking,
  CheckinPatientList,
  ExaminationPage,
  ExaminationResultPage,
  ExaminationDetailPage,
  ImagingList,
} from './sub-page';

export const EventNodePage = () => {
  const { path } = useRouteMatch();

  return (
    <AppShell>
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <SubMenuSideBar
            title="Events"
            titleLink="/events"
            subMenus={subMenus}
          />
          <ContentWrapper>
            <Switch>
              <Route exact path={path}>
                <SubMenuGrid title="Events" subMenus={subMenus} />
              </Route>
              <Route exact path={`${path}/registration`}>
                <RegisteredPatientList />
              </Route>
              <Route exact path={`${path}/registration/create`}>
                <CreateRegistration />
              </Route>
              <Route exact path={`${path}/booking`}>
                <BookedPatientList />
              </Route>
              <Route exact path={`${path}/booking/create`}>
                <CreateBooking />
              </Route>
              <Route exact path={`${path}/checkin`}>
                <CheckinPatientList />
              </Route>
              <Route exact path={`${path}/examination/result/:soapId`}>
                <ExaminationResultPage />
              </Route>
              <Route path={`${path}/examination/details/:soapId`}>
                <ExaminationDetailPage />
              </Route>
              <Route path={`${path}/examination`}>
                <ExaminationPage />
              </Route>
              <Route path={`${path}/imaging`}>
                <ImagingList />
              </Route>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
