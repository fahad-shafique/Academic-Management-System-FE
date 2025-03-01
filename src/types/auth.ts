import { User } from "./user";

export type AuthData = {
  isLoggedIn: boolean;
  user: any;
  setUser: any;
  login: boolean;
  updateLogin: (l: boolean) => void;
  clearState: () => void;
  authTokens: any;
  setAuthTokens: any;
};
