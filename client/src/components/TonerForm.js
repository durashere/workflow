import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField } from "@material-ui/core";

import { createToner } from "../reducers/tonerReducer";

const TonerForm = () => {
  const dispatch = useDispatch();
  const [model, setModel] = useState("");

  const addToner = async (event) => {
    event.preventDefault();
    dispatch(createToner(model));
    setModel("");
  };

  return (
    <div>
      <form onSubmit={addToner}>
        <div>
          <TextField
            label="Model"
            variant="outlined"
            value={model}
            onChange={({ target }) => setModel(target.value)}
          />
          <Button variant="outlined" color="primary" type="submit">
            create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TonerForm;
