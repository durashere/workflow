import React, { useState, useContext } from "react";
import { Form, Formik, Field } from "formik";
import { Grid, Button, MenuItem } from "@material-ui/core";
import { TextField } from "formik-material-ui";

import { AuthContext } from "../../context/AuthContext";
// import { createUser } from "../../reducers/userReducer";

import { publicFetch } from "../../util/fetch";

const UserForm = () => {
  const authContext = useContext(AuthContext);

  const [signupSuccess, setSignupSuccess] = useState();
  const [signupError, setSignupError] = useState();
  const [loginLoading, setLoginLoading] = useState(false);

  const groups = [
    {
      value: "admin",
      label: "Admin",
    },
    {
      value: "user",
      label: "User",
    },
  ];

  const submitCredentials = async (credentials) => {
    try {
      setLoginLoading(true);
      const { data } = await publicFetch.post("users", credentials);
      authContext.setAuthState(data);
      console.log(data);
    } catch (error) {
      setLoginLoading(false);
      const { data } = error.response;
      console.log(data.message);
      setSignupError(data.message);
      setSignupSuccess("");
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
