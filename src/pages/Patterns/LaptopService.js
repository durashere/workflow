import React, { useState } from "react";
import { makeStyles, Button, TextField } from "@material-ui/core";

import copyToClipboard from "../../util/copyToClipboard";

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
  },
  inputsContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    "& > *": {
      flex: "auto",
      padding: theme.spacing(1),
    },
  },
  buttonsContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    "& > *": {
      flex: "auto",
      margin: theme.spacing(1),
    },
  },
}));

const LaptopService = () => {
  const classes = useStyles();
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [cause, setCause] = useState("");

  const preview = `S/N: ${serialNumber}`;

  return (
    <div className={classes.rootContainer}>
      <div className={classes.inputsContainer}>
        <TextField
          label="Model"
          variant="outlined"
          value={model}
          onChange={({ target }) => setModel(target.value)}
        />

        <TextField
          label="Serial Number"
          variant="outlined"
          value={serialNumber}
          onChange={({ target }) => setSerialNumber(target.value)}
        />

        <TextField
          label="Cause"
          variant="outlined"
          value={cause}
          onChange={({ target }) => setCause(target.value)}
        />
      </div>
      <div className={classes.inputsContainer}>
        <TextField
          label="Preview"
          multiline
          fullWidth
          rows={10}
          value={preview}
          variant="outlined"
        />
      </div>
      <div className={classes.buttonsContainer}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => copyToClipboard(preview)}
        >
          copy to clipboard
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            (window.location.href = `mailto:${`${process.env.REACT_APP_MAIL_LAPTOP_SERVICE}`}?body=${
              encodeURIComponent(preview) || ""
            }`)
          }
        >
          send email
        </Button>
      </div>
    </div>
  );
};

export default LaptopService;
