import 'react-day-picker/lib/style.css';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
// import { Center, Icon, Image } from '@chakra-ui/react';
import { Center, Image } from '@chakra-ui/react';
// import { FaHospitalSymbol } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import LogoSvg from './Logo.svg';

import { getEmployeeDetail } from './api/human-capital-services/employee';
import { getUserPermissions } from './api/user-services/role-management';

import { AuthContext } from './contexts/authContext';
import {
  LoginPage,
  SignupPage,
  VerificationPage,
  SetPasswordPage,
  AddProfileInfoPage,
  AddHealthInfoPage,
  ForgotPasswordPage,
  ChangePasswordPage,
} from './pages/auth';
import {
  HomePage,
  BookingDoctorPage,
  BookingListPage,
  BookingDetailPage,
  OrderDetailPage,
} from './pages/web-patient';
import {
  DashboardPage,
  MasterPage,
  InstitutionManagementPage,
  UserManagementPage,
  EventNodePage,
  PharmacyPage,
  DivisionPage,
  FinancePage,
  PatientPage,
  PatientSoapPage,
  PatientSoapResultPage,
} from './pages/web-staff';
import { AccountSettingPage } from './pages/account-setting/AccountSettingPage';
import { PrivateRoute, Permissions } from './access-control';

const AuthenticatedRoute = ({ children, pageTitle = 'SMART-RS', ...rest }) => {
  const { token, user } = useContext(AuthContext);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Route
        {...rest}
        render={() => (token && user ? children : <Redirect to="/login" />)}
      />
    </>
  );
};

const AppRoutes = () => {
  return (
    <Switch>
      {/* Auth Routes */}
      <Route path="/signup">
        <SignupPage />
      </Route>
      <Route path="/verification">
        <VerificationPage />
      </Route>
      <Route path="/set-password">
        <SetPasswordPage />
      </Route>
      <Route path="/login" exact>
        <LoginPage />
      </Route>
      <Route path="/forgot-password">
        <ForgotPasswordPage />
      </Route>
      <Route path="/login/change-password">
        <ChangePasswordPage />
      </Route>
      <AuthenticatedRoute
        path="/add-profile-info"
        pageTitle="Add Profile Info | SMART-RS"
      >
        <AddProfileInfoPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute
        path="/add-health-info"
        pageTitle="Add Health Info | SMART-RS"
      >
        <AddHealthInfoPage />
      </AuthenticatedRoute>

      {/* Account Setting */}
      <AuthenticatedRoute
        path="/account-setting"
        pageTitle="Account Setting | SMART-RS"
        exact
      >
        <AccountSettingPage />
      </AuthenticatedRoute>

      {/* Web Patient Routes */}
      <AuthenticatedRoute path="/" exact>
        <HomePage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/doctor" exact>
        <BookingListPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/doctor/detail/:id">
        <BookingDetailPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute
        path="/doctor/booking"
        pageTitle="Booking Doctor | SMART-RS"
      >
        <BookingDoctorPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute
        path="/doctor/order/:id"
        pageTitle="Order Details | SMART-RS"
      >
        <OrderDetailPage />
      </AuthenticatedRoute>

      {/* Web Staff Routes */}
      <PrivateRoute
        permission={Permissions.indexDashboard}
        path="/dashboard"
        pageTitle="Dashboard | SMART-RS"
      >
        <DashboardPage />
      </PrivateRoute>
      <AuthenticatedRoute path="/master" pageTitle="Master | SMART-RS">
        <MasterPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute
        path="/institution-management"
        pageTitle="Institution Management | SMART-RS"
      >
        <InstitutionManagementPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute
        path="/user-management"
        pageTitle="User Management | SMART-RS"
      >
        <UserManagementPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/events" pageTitle="Event Node | SMART-RS">
        <EventNodePage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/pharmacy" pageTitle="Pharmacy | SMART-RS">
        <PharmacyPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/division" pageTitle="Division | SMART-RS">
        <DivisionPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/finance" pageTitle="Finance | SMART-RS">
        <FinancePage />
      </AuthenticatedRoute>
      <PrivateRoute
        permission={Permissions['read-detailExamination']}
        path="/patient/soap/:soapId"
        pageTitle="SOAP | SMART-RS"
      >
        <PatientSoapPage />
      </PrivateRoute>
      <PrivateRoute
        permission={Permissions['read-detailExamination']}
        path="/patient/soap-result/:soapId"
        pageTitle="Examination Result | SMART-RS"
      >
        <PatientSoapResultPage />
      </PrivateRoute>
      <PrivateRoute
        permission={Permissions.indexExamination}
        path="/patient"
        pageTitle="Patient | SMART-RS"
      >
        <PatientPage />
      </PrivateRoute>
    </Switch>
  );
};

// const App = () => {
//   const [cookies, , removeCookie] = useCookies();

//   const [token, setToken] = useState(cookies.token);
//   const [user, setUser] = useState(cookies.user);

//   useEffect(() => {
//     setToken(cookies.token);
//     setUser(cookies.user);
//   }, [cookies.token, cookies.user]);

//   const logout = async callback => {
//     removeCookie('token');
//     removeCookie('user');
//     callback();
//   };

//   return (
//     <Router>
//       <AuthContext.Provider value={{ token, setToken, logout, user, setUser }}>
//         <AppRoutes />
//       </AuthContext.Provider>
//     </Router>
//   );
// };
const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies();

  const [token, setToken] = useState(cookies.token);
  const [user, setUser] = useState(cookies.user);
  const [employeeDetail, setEmployeeDetail] = useState(cookies.employee);
  const [permissions, setPermissions] = useState([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [isLoadingEmployeeDetail, setIsLoadingEmployeeDetail] = useState(false);

  const logout = async callback => {
    removeCookie('token');
    removeCookie('user');
    removeCookie('employee');
    setPermissions([]);
    callback();
  };

  useEffect(() => {
    if (!cookies.token || !cookies.user || !cookies.employee) {
      setIsLoadingPermissions(false);
      return;
    }

    const fetchUserPermissions = async () => {
      try {
        setIsLoadingPermissions(true);
        const res = await getUserPermissions(cookies);
        // console.log({ resaaa: res });
        const userPermissions = Object.entries(res.data).map(
          ([, value]) => value
        );
        setPermissions(userPermissions);
        // setPermissions(res.data);
        setIsLoadingPermissions(false);
      } catch (error) {
        setPermissions([]);
        setIsLoadingPermissions(false);
      }
    };
    fetchUserPermissions();
  }, [cookies]);

  // useEffect(() => {
  //   const write = async () => {
  //     // console.log({ hai: 'ah' });
  //     await writeJsonFile('permission.json', permissions);
  //   };
  //   write();
  // }, [permissions]);

  useEffect(() => {
    if (!user?.id || !user?.institution_id) {
      return;
    }
    const fetchEmployeeDetail = async () => {
      try {
        setIsLoadingEmployeeDetail(true);
        const resEmployee = await getEmployeeDetail(
          token,
          user?.institution_id,
          user?.id
        );
        // console.log({ resEmployee });
        const employeeDetail = {
          employee_id: resEmployee?.data?.employee_data?.id,
          institution_id: resEmployee?.data?.employee_data?.institution_id,
          employee_number: resEmployee?.data?.employee_data?.employee_number,
          profession: resEmployee?.data?.employee_data?.profession,
        };
        setCookie('employee', JSON.stringify(employeeDetail), { path: '/' });
        setIsLoadingEmployeeDetail(false);
      } catch (error) {
        // console.log({ error });
        setIsLoadingEmployeeDetail(false);
      }
    };
    fetchEmployeeDetail();
  }, [setCookie, token, user?.id, user?.institution_id]);

  useEffect(() => {
    setToken(cookies.token);
    setUser(cookies.user);
    setEmployeeDetail(cookies.employee);
  }, [cookies.token, cookies.user, cookies.employee]);

  // console.log({ user });
  // console.log({ employeeDetail });
  // console.log({ permissions });

  return (
    <Router>
      <AuthContext.Provider
        value={{
          token,
          setToken,
          logout,
          user,
          setUser,
          permissions,
          isLoadingPermissions,
          employeeDetail,
          setEmployeeDetail,
        }}
      >
        {isLoadingPermissions && isLoadingEmployeeDetail ? (
          <Center style={{ height: '100vh' }}>
            <motion.div
              animate={{
                scale: [1, 1.8, 1.8, 1, 1],
                rotate: [0, 0, 270, 270, 0],
                borderRadius: ['20%', '20%', '50%', '50%', '20%'],
              }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              {/* <Icon as={FaHospitalSymbol} w="16" h="16" fill="blue.600" /> */}
              <Image src={LogoSvg} w="16" />
            </motion.div>
          </Center>
        ) : (
          <AppRoutes />
        )}
      </AuthContext.Provider>
    </Router>
  );
};

export default App;
