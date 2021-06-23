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
import { Center, Icon } from '@chakra-ui/react';
import { FaHospitalSymbol } from 'react-icons/fa';
import { motion } from 'framer-motion';
// import * as writeJsonFile from 'write-json-file';

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

const AuthenticatedRoute = ({ children, ...rest }) => {
  const { token, user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={() => (token && user ? children : <Redirect to="/login" />)}
    />
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
      <AuthenticatedRoute path="/add-profile-info">
        <AddProfileInfoPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/add-health-info">
        <AddHealthInfoPage />
      </AuthenticatedRoute>

      {/* Account Setting */}
      <AuthenticatedRoute path="/account-setting" exact>
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
      <AuthenticatedRoute path="/doctor/booking">
        <BookingDoctorPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/doctor/order/:id">
        <OrderDetailPage />
      </AuthenticatedRoute>

      {/* Web Staff Routes */}
      <AuthenticatedRoute path="/dashboard">
        <DashboardPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/master">
        <MasterPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/institution-management">
        <InstitutionManagementPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/user-management">
        <UserManagementPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/events">
        <EventNodePage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/pharmacy">
        <PharmacyPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/division">
        <DivisionPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/finance">
        <FinancePage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/patient/soap/:soapId">
        <PatientSoapPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/patient/soap-result/:soapId">
        <PatientSoapResultPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/patient">
        <PatientPage />
      </AuthenticatedRoute>
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
              animate={{ rotate: 180 }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <Icon as={FaHospitalSymbol} w="16" h="16" fill="blue.600" />
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
