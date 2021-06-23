import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Text } from '@chakra-ui/react';

import { AuthContext } from '../contexts/authContext';

export const PrivateRoute = ({ children, permission, ...rest }) => {
  const { permissions, isLoadingPermissions, employeeDetail, user } =
    useContext(AuthContext);

  if (isLoadingPermissions) return <Text>Loading...</Text>;

  if (user?.role?.alias === 'super-admin' || permissions.includes(permission)) {
    return <Route {...rest}>{children}</Route>;
  } else if (employeeDetail?.employee_id) {
    return <Redirect to="/dashboard" />;
  } else {
    return <Redirect to="/" />;
  }
};
