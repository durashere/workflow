import tonerService from "../services/tonerService";

const tonerReducer = (state = [], action) => {
  console.log("tonerReducer state now: ", state);
  console.log("tonerReducer action", action);

  switch (action.type) {
    case "INIT_TONERS":
      return action.data;

    case "CREATE_TONER":
      return state.concat(action.data);

    case "ADD_TONER":
      return state.map((t) => (t.id === action.data.id ? action.data : t));

    case "SUB_TONER":
      return state.map((t) => (t.id === action.data.id ? action.data : t));

    case "REMOVE_TONER":
      return state.filter((t) => t.id !== action.data.id);

    default:
      return state;
  }
};

export const initToners = () => {
  return async (dispatch) => {
    const toners = await tonerService.getAll();
    dispatch({
      type: "INIT_TONERS",
      data: toners,
    });
  };
};

export const createToner = (model) => {
  return async (dispatch) => {
    const tonerToCreate = { model, amount: 0 };
    const newToner = await tonerService.create(tonerToCreate);
    dispatch({
      type: "CREATE_TONER",
      data: newToner,
    });
  };
};

export const addToner = (toner) => {
  return async (dispatch, getState) => {
    const tonerToChange = getState().toners.find((a) => a.id === toner.id);
    const addedToner = {
      ...tonerToChange,
      amount: tonerToChange.amount + 1,
    };
    const updatedToner = await tonerService.update(toner.id, addedToner);
    dispatch({ type: "ADD_TONER", data: updatedToner });
  };
};

export const subToner = (toner) => {
  return async (dispatch, getState) => {
    const tonerToChange = getState().toners.find((a) => a.id === toner.id);
    const addedToner = {
      ...tonerToChange,
      amount: tonerToChange.amount - 1,
    };
    const updatedToner = await tonerService.update(toner.id, addedToner);
    dispatch({ type: "ADD_TONER", data: updatedToner });
  };
};

export const removeToner = (toner) => {
  return async (dispatch) => {
    await tonerService.remove(toner.id);
    dispatch({ type: "REMOVE_TONER", data: toner });
  };
};

export default tonerReducer;
