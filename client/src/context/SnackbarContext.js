import React, { useState, useEffect, createContext } from "react";

import MuiAlert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

export const SnackbarContext = createContext();

const AUTO_DISMISS = 5000;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function SnackbarProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const activeAlertIds = alerts.join(",");

  useEffect(() => {
    if (activeAlertIds.length > 0) {
      const timer = setTimeout(
        () => setAlerts((alerts) => alerts.slice(0, alerts.length - 1)),
        5000,
      );
      return () => clearTimeout(timer);
    }
  }, [activeAlertIds]);

  const addAlert = (alert) => setAlerts((alerts) => [alert, ...alerts]);

  const value = { addAlert };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {alerts.map((alert) => (
        <Snackbar
          key={alert}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={!!alerts}
        >
          <Alert severity={"success"}>{alert}</Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
}
