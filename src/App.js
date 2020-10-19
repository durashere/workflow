import React, { lazy, Suspense, useContext } from "react";
import PropTypes from "prop-types";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { FetchProvider } from "./context/FetchContext";
import { SnackbarProvider } from "./context/SnackbarContext";

import AppShell from "./AppShell";

import Login from "./pages/Login";
import FourOFour from "./pages/FourOFour";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserListAdmin = lazy(() => import("./pages/User/UserListAdmin"));
const UserForm = lazy(() => import("./pages/User/UserForm"));
const TonerList = lazy(() => import("./pages/Toner/TonerList"));
const TonerListAdmin = lazy(() => import("./pages/Toner/TonerListAdmin"));
const Patterns = lazy(() => import("./pages/Patterns/Patterns"));

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const App = () => {
  const classes = useStyles();

  const LoadingFallback = () => (
    <AppShell>
      <Backdrop className={classes.backdrop} open>
        <CircularProgress color="inherit" />
      </Backdrop>
    </AppShell>
  );

  const UnauthenticatedRoutes = () => (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>

      <Route path="*">
        <FourOFour />
      </Route>
    </Switch>
  );

  const AuthenticatedRoute = ({ children, path }) => {
    const auth = useContext(AuthContext);
    return (
      <Route
        path={path}
        render={() =>
          auth.isAuthenticated() ? (
            <AppShell>{children}</AppShell>
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  };

  AuthenticatedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    path: PropTypes.string.isRequired,
  };

  const AdminRoute = ({ children, path }) => {
    const auth = useContext(AuthContext);
    return (
      <Route
        path={path}
        render={() =>
          auth.isAuthenticated() && auth.isAdmin() ? (
            <AppShell>{children}</AppShell>
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  };

  AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
    path: PropTypes.string.isRequired,
  };

  const AppRoutes = () => {
    const auth = useContext(AuthContext);

    return (
      <>
        <Suspense fallback={<LoadingFallback />}>
          <Switch>
            <Route
              exact
              path="/"
              render={() => {
                return auth.isAuthenticated() ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Redirect to="/login" />
                );
              }}
            />

            <AuthenticatedRoute path="/dashboard">
              <Dashboard />
            </AuthenticatedRoute>

            <AuthenticatedRoute path="/toners">
              <TonerList />
            </AuthenticatedRoute>

            <AuthenticatedRoute path="/tools/patterns">
              <Patterns />
            </AuthenticatedRoute>

            <AdminRoute path="/admin/users">
              <UserListAdmin />
            </AdminRoute>

            <AdminRoute path="/admin/users/create">
              <UserForm />
            </AdminRoute>

            <AdminRoute path="/admin/toners">
              <TonerListAdmin />
            </AdminRoute>

            <UnauthenticatedRoutes />
          </Switch>
        </Suspense>
      </>
    );
  };

  return (
    <Router>
      <SnackbarProvider>
        <AuthProvider>
          <FetchProvider>
            <AppRoutes />
          </FetchProvider>
        </AuthProvider>
      </SnackbarProvider>
    </Router>
  );
};

export default App;
