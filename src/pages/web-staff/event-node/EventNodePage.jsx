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
import { AuthContext } from '../../../contexts/authContext';

export const EventNodePage = () => {
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
      <Box height="full" overflow="hidden" position="relative">
        <Flex h="full">
          <SubMenuSideBar
            title="Events"
            titleLink="/events"
            subMenus={
              user?.role?.alias === 'super-admin' ? subMenus : showedSubMenus
            }
          />
          <ContentWrapper>
            <Switch>
              <PrivateRoute
                permission={Permissions.dashboardEventNode}
                exact
                path={path}
                pageTitle="Event Node | SMART-RS"
              >
                <SubMenuGrid
                  title="Events"
                  subMenus={
                    user?.role?.alias === 'super-admin'
                      ? subMenus
                      : showedSubMenus
                  }
                />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexRegistration}
                exact
                path={`${path}/registration`}
                pageTitle="Registration | SMART-RS"
              >
                <RegisteredPatientList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.createRegistration}
                exact
                path={`${path}/registration/create`}
                pageTitle="Register New Patient | SMART-RS"
              >
                <CreateRegistration />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexBookingDoctor}
                exact
                path={`${path}/booking`}
                pageTitle="Booking | SMART-RS"
              >
                <BookedPatientList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.createBookingDoctor}
                exact
                path={`${path}/booking/create`}
                pageTitle="Create New Booking | SMART-RS"
              >
                <CreateBooking />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexCheckIn}
                exact
                path={`${path}/checkin`}
                pageTitle="Check-in | SMART-RS"
              >
                <CheckinPatientList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailExamination']}
                exact
                path={`${path}/examination/result/:soapId`}
                pageTitle="Examination Result | SMART-RS"
              >
                <ExaminationResultPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailExamination']}
                path={`${path}/examination/details/:soapId`}
                pageTitle="SOAP | SMART-RS"
              >
                <ExaminationDetailPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexExamination}
                path={`${path}/examination`}
                pageTitle="Examination | SMART-RS"
              >
                <ExaminationPage />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexBookingRadiology}
                exact
                path={`${path}/imaging`}
                pageTitle="Imaging | SMART-RS"
              >
                <ImagingList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailBookingRadiology']}
                exact
                path={`${path}/imaging/details/:id`}
                pageTitle="Detail Imaging | SMART-RS"
              >
                <ImagingDetails />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexBloodDraw}
                exact
                path={`${path}/blood-draw`}
                pageTitle="Blood Draw | SMART-RS"
              >
                <BloodDrawList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexBloodTest}
                exact
                path={`${path}/blood-test`}
                pageTitle="Blood Test | SMART-RS"
              >
                <BloodTestList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailBloodResult']}
                exact
                path={`${path}/blood-test-result/:id`}
                pageTitle="Blood Test Result | SMART-RS"
              >
                <BloodTestResult />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexReceipt}
                exact
                path={`${path}/collect-medicine`}
                pageTitle="Collect Medicine | SMART-RS"
              >
                <CollectMedicineList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.updateReceipt}
                exact
                path={`${path}/collect-medicine/:id`}
                pageTitle="Collect Medicine | SMART-RS"
              >
                <CollectMedicineDetails />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions.indexPayment}
                exact
                path={`${path}/payment`}
                pageTitle="Payment | SMART-RS"
              >
                <PaymentList />
              </PrivateRoute>
              <PrivateRoute
                permission={Permissions['read-detailPayment']}
                exact
                path={`${path}/payment/:id`}
                pageTitle="Payment Detail | SMART-RS"
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
