import React, { useState, useContext } from "react";
import { Form, Formik, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Grid, Button, MenuItem } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";

import { FetchContext } from "../../context/FetchContext";

const UserForm = () => {
  const fetchContext = useContext(FetchContext);

  const [signupSuccess, setSignupSuccess] = useState();
  const [signupError, setSignupError] = useState();
  const [loginLoading, setLoginLoading] = useState(false);

  const submitCredentials = async (credentials) => {
    try {
      setLoginLoading(true);
      const { data } = await fetchContext.authAxios.post("users", credentials);
      setSignupSuccess(data.message);
      setSignupError("");
      setLoginLoading(false);
    } catch (error) {
      setLoginLoading(false);
      const { data } = error.response;
      setSignupError(data.message);
      setSignupSuccess("");
    }
  };

  return (
    <div>
      {loginLoading && <LinearProgress />}
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
          <Grid container direction={"column"} spacing={1}>
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
    </div>
  );
};

export default UserForm;
