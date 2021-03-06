import React, { createContext, useContext } from "react";

import PropTypes from "prop-types";

import axios from "axios";

import { AuthContext } from "./AuthContext";

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  const authAxios = axios.create({
    baseURL:
      process.env.NODE_ENV === "production"
        ? "/api"
        : process.env.REACT_APP_DEV_API_URL,
  });

  authAxios.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${authContext.authState.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const code = error && error.response ? error.response.status : 0;
      if (code === 401 || code === 403) {
        console.log("error code", code);
      }
      return Promise.reject(error);
    },
  );

  return (
    <Provider
      value={{
        authAxios,
      }}
    >
      {children}
    </Provider>
  );
};

FetchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { FetchContext, FetchProvider };
