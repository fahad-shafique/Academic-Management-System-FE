import React, { useContext, useState } from "react";

import { AuthData } from "../types/auth";
import { Props } from "../types/props";
import { User } from "../types/user";
import {jwtDecode} from 'jwt-decode';

const initialData: AuthData = {
  isLoggedIn: false,
  login: false,
  user: '',
  setUser: '',
  updateLogin: (l: boolean) => {},
  clearState: () => {},
  authTokens: '',
  setAuthTokens: '',
};

const AuthContext = React.createContext(initialData);

export const AuthProvider = (props: Props) => {
  const [authTokens, setAuthTokens] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        return storedTokens ? JSON.parse(storedTokens) : null;
    });
    const [user, setUser] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        return storedTokens ? jwtDecode(storedTokens) : null;
    });
  const [login, updateLogin] = useState<boolean>(false);

  const isLoggedIn = !!authTokens;

  const clearState = () => {
    setAuthTokens(null);
    setUser(null);
    updateLogin(false);
  }

  const authContext: AuthData = {
    authTokens,
    setAuthTokens,
    isLoggedIn,
    user,
    setUser,
    login,
    updateLogin,
    clearState,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  )
};


export const useAuth = () => useContext(AuthContext);

export default AuthContext;
