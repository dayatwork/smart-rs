import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { AuthContext } from '../contexts/authContext';

export const PrivateRoute = ({ children, permission, pageTitle, ...rest }) => {
  const { permissions, isLoadingPermissions, employeeDetail, user } =
    useContext(AuthContext);

  if (isLoadingPermissions) return null;

  if (user?.role?.alias === 'super-admin' || permissions.includes(permission)) {
    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <Route {...rest}>{children}</Route>
      </>
    );
  } else if (employeeDetail?.employee_id) {
    return <Redirect to="/dashboard" />;
  } else {
    return <Redirect to="/" />;
  }
};
