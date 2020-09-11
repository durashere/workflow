import userService from "../services/userService";

const userReducer = (state = [], action) => {
  console.log("userReducer state now: ", state);
  console.log("userReducer action", action);

  switch (action.type) {
    case "INIT_USERS":
      return action.data;

    case "CURRENT_USER":
      return action.data;

    case "CREATE_USER":
      return state.concat(action.data);

    case "REMOVE_USER":
      return state.filter((u) => u.id !== action.data);

    default:
      return state;
  }
};

export const initUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll();
    dispatch({
      type: "INIT_USERS",
      data: users,
    });
  };
};

export const createUser = (userObject) => {
  return async (dispatch) => {
    const userToAdd = await userService.create(userObject);
    dispatch({
      type: "CREATE_USER",
      data: userToAdd,
    });
  };
};

export const removeUser = (userObject) => {
  return async (dispatch) => {
    await userService.remove(userObject.id);
    dispatch({ type: "REMOVE_USER", data: userObject.id });
  };
};

export default userReducer;
