import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { orange, deepOrange } from "@material-ui/core/colors";
import App from "./App";
import store from "./store";
import tonerService from "./services/tonerService";
import { initToners } from "./reducers/tonerReducer";

tonerService.getAll().then((toners) => store.dispatch(initToners(toners)));

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: orange[500],
    },
    secondary: {
      main: deepOrange[900],
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root"),
);
