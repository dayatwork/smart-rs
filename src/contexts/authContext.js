import { createContext } from 'react';

const AuthContext = createContext({
  user: null,
  logout: () => {},
  setUser: () => {},
  setCookie: () => {},
  token: null,
  setToken: () => {},
  cookie: null,
});

export { AuthContext };
