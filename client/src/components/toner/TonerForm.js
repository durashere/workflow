import React, { useState, useContext } from "react";
import { Form, Formik, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Grid, Button, MenuItem } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";

import { FetchContext } from "../../context/FetchContext";

const TonerForm = () => {
  const fetchContext = useContext(FetchContext);
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const submitNewToner = async (newToner, resetForm) => {
    console.log("newToner", newToner);
    try {
      const { data } = await fetchContext.authAxios.post("toners", newToner);

      resetForm();
      setSuccessMessage(data.message);
      setErrorMessage(null);
    } catch (err) {
      const { data } = err.response;
      setSuccessMessage(null);
      setErrorMessage(data.message);
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
