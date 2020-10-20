import React, { useState, useContext } from "react";

import { useSnackbar } from "notistack";

import { Grid, Button, LinearProgress } from "@material-ui/core";

import { Form, Formik, Field } from "formik";
import { TextField } from "formik-material-ui";

import { FetchContext } from "../../context/FetchContext";

const UserForm = () => {
  const fetchContext = useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

  const submitCredentials = async (credentials) => {
    try {
      setIsLoading(true);
      const { data } = await fetchContext.authAxios.post("users", credentials);
      setIsLoading(false);

      enqueueSnackbar(data.message, {
        variant: "success",
      });
    } catch (error) {
      setIsLoading(false);
      const { data } = error.response;

      enqueueSnackbar(data.message, {
        variant: "success",
      });
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          username: "",
          password: "",
        }}
        onSubmit={(values) => submitCredentials(values)}
        // validationSchema={SignupSchema}
      >
        <Form>
          <Grid container direction="column" spacing={1}>
            <Grid item xs>
              <Field
                component={TextField}
                variant="outlined"
                required
                fullWidth
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
            </Grid>

            <Grid item xs>
              <Field
                component={TextField}
                variant="outlined"
                required
                fullWidth
                label="First Name"
                name="firstName"
                autoComplete="given-name"
              />
            </Grid>

            <Grid item xs>
              <Field
                component={TextField}
                variant="outlined"
                required
                fullWidth
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>

            <Grid item xs>
              <Field
                component={TextField}
                variant="outlined"
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
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
      {isLoading && <LinearProgress />}
    </div>
  );
};

export default UserForm;
