import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../contexts/authContext';

export const SuperAdminRoute = ({ children, ...rest }) => {
  const { user } = useContext(AuthContext);

  if (user?.role?.alias === 'super-admin') {
    return <Route {...rest}>{children}</Route>;
  }

  return <Redirect to="/dashboard" />;
};
