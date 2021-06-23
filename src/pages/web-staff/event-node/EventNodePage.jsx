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
  RegisteredPatientList,
  CreateRegistration,
  BookedPatientList,
  CreateBooking,
  CheckinPatientList,
  ExaminationPage,
  ExaminationResultPage,
  ExaminationDetailPage,
  ImagingList,
  ImagingDetails,
  BloodDrawList,
  BloodTestList,
  BloodTestResult,
  CollectMedicineList,
  CollectMedicineDetails,
  PaymentList,
  PaymentDetails,
} from './sub-page';
import { PrivateRoute, Permissions } from '../../../access-control';

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
              <PrivateRoute
                permission={Permissions.dashboardEventNode}
                exact
                path={path}
              >
                <SubMenuGrid title="Events" subMenus={subMenus} />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexRegistration}
                exact
                path={`${path}/registration`}
              >
                <RegisteredPatientList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.createRegistration}
                exact
                path={`${path}/registration/create`}
              >
                <CreateRegistration />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexBookingDoctor}
                exact
                path={`${path}/booking`}
              >
                <BookedPatientList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.createBookingDoctor}
                exact
                path={`${path}/booking/create`}
              >
                <CreateBooking />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexCheckIn}
                exact
                path={`${path}/checkin`}
              >
                <CheckinPatientList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailExamination']}
                exact
                path={`${path}/examination/result/:soapId`}
              >
                <ExaminationResultPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailExamination']}
                path={`${path}/examination/details/:soapId`}
              >
                <ExaminationDetailPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexExamination}
                path={`${path}/examination`}
              >
                <ExaminationPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexBookingRadiology}
                exact
                path={`${path}/imaging`}
              >
                <ImagingList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailBookingRadiology']}
                exact
                path={`${path}/imaging/details/:id`}
              >
                <ImagingDetails />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexBloodDraw}
                exact
                path={`${path}/blood-draw`}
              >
                <BloodDrawList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexBloodTest}
                exact
                path={`${path}/blood-test`}
              >
                <BloodTestList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailBloodResult']}
                exact
                path={`${path}/blood-test-result/:id`}
              >
                <BloodTestResult />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexReceipt}
                exact
                path={`${path}/collect-medicine`}
              >
                <CollectMedicineList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.updateReceipt}
                exact
                path={`${path}/collect-medicine/:id`}
              >
                <CollectMedicineDetails />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexPayment}
                exact
                path={`${path}/payment`}
              >
                <PaymentList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailPayment']}
                exact
                path={`${path}/payment/:id`}
              >
                <PaymentDetails />
              </PrivateRoute>
            </Switch>
          </ContentWrapper>
        </Flex>
      </Box>
    </AppShell>
  );
};
