import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { orange, deepOrange } from "@material-ui/core/colors";
import App from "./App";
import store from "./store";

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
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root"),
);
