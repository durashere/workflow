import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import tonerReducer from "./reducers/tonerReducer";
import userReducer from "./reducers/userReducer";
import currentUserReducer from "./reducers/currentUserReducer";

const reducer = combineReducers({
  toners: tonerReducer,
  users: userReducer,
  currentUser: currentUserReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
