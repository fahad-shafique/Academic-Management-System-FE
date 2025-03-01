import {useContext, useEffect} from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthContext";

const useAxios = () => {
  const { user, authTokens } = useContext(AuthContext);

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (authTokens.access && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${authTokens.access}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          return axios(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [authTokens.access, '']);

  return axios;
};

export default useAxios;
