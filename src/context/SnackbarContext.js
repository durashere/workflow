import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  createContext,
} from "react";

import MuiAlert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

export const SnackbarContext = createContext();

const AUTO_DISMISS = 3000;

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
        AUTO_DISMISS,
      );
      return () => clearTimeout(timer);
    }
  }, [activeAlertIds]);

  const addAlert = useCallback(
    (message, type) => setAlerts((alerts) => [{ message, type }, ...alerts]),
    [],
  );

  const value = useMemo(() => ({ addAlert }), [addAlert]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {alerts.map((alert) => (
        <Snackbar
          key={alert.message}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={!!alerts}
        >
          <Alert severity={alert.type}>{alert.message}</Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
}
