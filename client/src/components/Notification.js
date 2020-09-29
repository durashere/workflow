import React from "react";

import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function FormError({ type, state, setState }) {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={!!state}
      autoHideDuration={6000}
      onClose={() => setState(null)}
    >
      <Alert onClose={() => setState(null)} severity={type}>
        {state}
      </Alert>
    </Snackbar>
  );
}
