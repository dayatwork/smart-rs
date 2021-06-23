import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Text } from '@chakra-ui/react';

import { AuthContext } from '../contexts/authContext';

export const PrivateRoute = ({ children, permission, ...rest }) => {
  const { permissions, isLoadingPermissions } = useContext(AuthContext);

  if (isLoadingPermissions) return <Text>Loading...</Text>;

  if (permissions.includes(permission)) {
    return <Route {...rest}>{children}</Route>;
  }

  return <Redirect to="/dashboard" />;
};
