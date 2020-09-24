import { userService } from "../services/serviceExporter";

const currentUserReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_USER":
      return state;

    case "LOGIN_USER":
      return action.data;

    case "LOGOUT_USER":
      return null;

    default:
      return state;
  }
};

export const getUser = (user) => {
  return async (dispatch) => {
    dispatch({
      type: "GET_USER",
      data: user,
    });
  };
};

export const loginUser = (passedUser) => {
  return async (dispatch) => {
    const users = await userService.getAll();
    console.log("users", users);
    const currentUser = users.find(
      (user) => user.username === passedUser.username,
    );
    dispatch({
      type: "LOGIN_USER",
      data: currentUser,
    });
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch({
      type: "LOGOUT_USER",
    });
  };
};

export default currentUserReducer;
