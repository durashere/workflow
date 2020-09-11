const currentUserReducer = (state = null, action) => {
  console.log("currentUserReducer state now: ", state);
  console.log("currentUserReducer action", action);

  switch (action.type) {
    case "GET_USER":
      return action.data;

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

export const loginUser = (user) => {
  return async (dispatch) => {
    dispatch({
      type: "LOGIN_USER",
      data: user,
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
