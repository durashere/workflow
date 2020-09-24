import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Main from "./components/Main";
import SignIn from "./components/SignIn";

import userService from "./services/userService";
import tonerService from "./services/tonerService";

import { loginUser } from "./reducers/currentUserReducer";
import { initToners } from "./reducers/tonerReducer";
import { initUsers } from "./reducers/userReducer";

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);

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

  return <div>{currentUser ? <Main /> : <SignIn />}</div>;
}

export default App;
