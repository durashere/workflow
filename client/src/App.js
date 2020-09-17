import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import tonerService from "./services/tonerService";

import SignIn from "./components/SignIn";
import Main from "./components/Main";

import { getUser } from "./reducers/currentUserReducer";

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const signInUser = JSON.parse(loggedUserJSON);
      dispatch(getUser(signInUser));
      tonerService.setToken(signInUser.token);
    }
  }, [dispatch]);

  return <div>{currentUser === null ? <SignIn /> : <Main />}</div>;
}

export default App;
