// import React, { lazy, Suspense, useContext } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Switch,
//   Redirect,
// } from "react-router-dom";

// import { AuthProvider, AuthContext } from "./context/AuthContext";
// import { FetchProvider } from "./context/FetchContext";

// import AppShell from "./AppShell";

// import Main from "./components/Main";
// import Login from "./components/SignIn";
// import Signup from "./pages/Signup";
// import FourOFour from "./pages/FourOFour";

// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const Inventory = lazy(() => import("./pages/Inventory"));
// const Account = lazy(() => import("./pages/Account"));
// const Settings = lazy(() => import("./pages/Settings"));
// const Users = lazy(() => import("./pages/Users"));

import React, { useEffect, useContext } from "react";
import {
  useDispatch,
  // useSelector
} from "react-redux";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { FetchProvider } from "./context/FetchContext";

import Main from "./components/Main";
import SignIn from "./components/SignIn";

import userService from "./services/userService";
import tonerService from "./services/tonerService";

import { loginUser } from "./reducers/currentUserReducer";
import { initToners } from "./reducers/tonerReducer";
import { initUsers } from "./reducers/userReducer";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const signInUser = JSON.parse(loggedUserJSON);

      userService.setToken(signInUser.token);
      tonerService.setToken(signInUser.token);

      dispatch(initToners());
      dispatch(initUsers());

      dispatch(loginUser(signInUser.userInfo));
    }
  }, [dispatch]);

  return (
    <div>{window.localStorage.getItem("user") ? <Main /> : <SignIn />}</div>
  );
}

export default App;
