import React, { useState } from "react";
import { makeStyles, Button, TextField, MenuItem } from "@material-ui/core";

import copyToClipboard from "../../util/copyToClipboard";
import sendEmail from "../../util/sendEmail";

const models = [
  {
    model: "Lenovo T450",
  },
  {
    model: "Lenovo T460",
  },
  {
    model: "Lenovo T470",
  },
  {
    model: "Lenovo T480s",
  },
];

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

  const pattern = `Dzień dobry

Proszę o serwis laptopa:
- Lenovo ${model}
- S/N: ${serialNumber}

${cause}`;

  return (
    <div className={classes.rootContainer}>
      <div className={classes.inputsContainer}>
        <TextField
          label="Model"
          variant="outlined"
          select
          value={model}
          onChange={({ target }) => setModel(target.value)}
        >
          {models.map((option) => (
            <MenuItem key={option.model} value={option.model}>
              {option.model}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Serial Number"
          variant="outlined"
          value={serialNumber}
          onChange={({ target }) => setSerialNumber(target.value)}
        />
      </div>
      <div className={classes.inputsContainer}>
        <TextField
          label="Cause"
          variant="outlined"
          value={cause}
          onChange={({ target }) => setCause(target.value)}
        />
      </div>
      <div className={classes.inputsContainer}>
        <TextField
          label="Pattern"
          multiline
          fullWidth
          rows={10}
          value={pattern}
          variant="outlined"
        />
      </div>
      <div className={classes.buttonsContainer}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => copyToClipboard(pattern)}
        >
          copy pattern
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            sendEmail(
              process.env.REACT_APP_MAIL_LAPTOP_SERVICE,
              "Zgłoszenie laptopa do serwisu",
              pattern,
            )
          }
        >
          send email
        </Button>
      </div>
    </div>
  );
};

export default LaptopService;
