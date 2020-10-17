import React, { useState } from "react";
import { makeStyles, Grid, Button, TextField } from "@material-ui/core";

const fields = {};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  formContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
  formInput: {
    width: "100px",
  },
  // cmsMail: {
  //   width: "100%",
  // },
}));

const LaptopService = () => {
  const classes = useStyles();
  const [serialNumber, setSerialNumber] = useState("");
  const [model, setModel] = useState("");
  const [cause, setCause] = useState("");

  const preview = `S/N: ${serialNumber}`;

  return (
    <div className={classes.formContainer}>
      <form className={classes.root} noValidate autoComplete="off">
        <div className={classes.formContainer}>
          <TextField
            className={classes.formInput}
            label="Model"
            variant="outlined"
            value={model}
            onChange={({ target }) => setModel(target.value)}
          />

          <TextField
            className={classes.formInput}
            label="Serial Number"
            variant="outlined"
            value={serialNumber}
            onChange={({ target }) => setSerialNumber(target.value)}
          />

          <TextField
            className={classes.formInput}
            label="Cause"
            variant="outlined"
            value={cause}
            onChange={({ target }) => setCause(target.value)}
          />
        </div>
      </form>
      <div>
        <TextField
          className={classes.cmsMail}
          label="Preview"
          multiline
          rows={10}
          value={preview}
          variant="outlined"
        />
      </div>
    </div>
  );
};

export default LaptopService;
