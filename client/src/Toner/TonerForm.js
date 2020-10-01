import React, { useState, useContext } from "react";
import { Form, Formik, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Grid, Button, LinearProgress } from "@material-ui/core";

import { FetchContext } from "../context/FetchContext";
import useSnackbars from "../hooks/useSnackbars";

const TonerForm = () => {
  const fetchContext = useContext(FetchContext);
  const { addAlert } = useSnackbars();

  const [isLoading, setIsLoading] = useState(false);

  const submitNewToner = async (newToner) => {
    try {
      setIsLoading(true);
      const { data } = await fetchContext.authAxios.post("toners", newToner);
      setIsLoading(false);

      addAlert(data.message, "success");
    } catch (error) {
      setIsLoading(false);
      const { data } = error.response;

      addAlert(data.message, "error");
    }
  };

  return (
    <div>
      {isLoading && <LinearProgress />}
      <Formik
        initialValues={{
          model: "",
        }}
        onSubmit={(values) => submitNewToner(values)}
      >
        <Form>
          <Grid container direction={"column"} spacing={1}>
            <Grid item xs>
              <Field
                component={TextField}
                variant="outlined"
                required
                fullWidth
                label="Model"
                name="model"
                autoFocus
              />
            </Grid>
            <Grid item xs>
              <Button
                fullWidth
                type="submit"
                variant="outlined"
                color="primary"
              >
                create
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </div>
  );
};

export default TonerForm;
