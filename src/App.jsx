import 'react-day-picker/lib/style.css';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

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
} from './pages/web-patient';
import {
  DashboardPage,
  MasterPage,
  InstitutionManagementPage,
  UserManagementPage,
  EventNodePage,
  PharmacyPage,
  DivisionPage,
} from './pages/web-staff';

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
    </Switch>
  );
};

const App = () => {
  const [cookies, , removeCookie] = useCookies();

  const [token, setToken] = useState(cookies.token);
  const [user, setUser] = useState(cookies.user);

  useEffect(() => {
    setToken(cookies.token);
    setUser(cookies.user);
  }, [cookies.token, cookies.user]);

  const logout = async (callback) => {
    removeCookie('token');
    removeCookie('user');
    callback();
  };

  return (
    <Router>
      <AuthContext.Provider value={{ token, setToken, logout, user, setUser }}>
        <AppRoutes />
      </AuthContext.Provider>
    </Router>
  );
};

export default App;
