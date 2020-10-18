import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { Form, Formik, Field } from "formik";
import { TextField } from "formik-material-ui";

import {
  makeStyles,
  Container,
  Box,
  Typography,
  LinearProgress,
  Avatar,
  Button,
  CssBaseline,
} from "@material-ui/core";

import { Lock as LockIcon } from "@material-ui/icons";

import { AuthContext } from "../context/AuthContext";
import publicFetch from "../util/fetch";
import useSnackbars from "../hooks/useSnackbars";

import Footer from "../Footer";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();
  const authContext = useContext(AuthContext);
  const { addAlert } = useSnackbars();

  const [redirectOnLogin, setRedirectOnLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitCredentials = async (credentials) => {
    try {
      setIsLoading(true);
      const { data } = await publicFetch.post(`login`, credentials);
      authContext.setAuthState(data);
      setIsLoading(false);

      addAlert(data.message, "success");

      setTimeout(() => {
        setRedirectOnLogin(true);
      }, 700);
    } catch (error) {
      setIsLoading(false);
      const { data } = error.response;

      addAlert(data.message, "error");
    }
  };

  return (
    <>
      {redirectOnLogin && <Redirect to="/dashboard" />}

      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={(values) => submitCredentials(values)}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Form className={classes.form}>
              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
              />
              {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Login
              </Button>
              {isLoading && <LinearProgress />}
              {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
            </Form>
          </div>
          <Box mt={8}>
            <Footer />
          </Box>
        </Container>
      </Formik>
    </>
  );
};

export default Login;
