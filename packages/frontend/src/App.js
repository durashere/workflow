import React, { lazy, Suspense, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { SnackbarProvider } from "notistack";

import PropTypes from "prop-types";

import { makeStyles, Backdrop, CircularProgress } from "@material-ui/core";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { FetchProvider } from "./context/FetchContext";

import AppShell from "./AppShell";

import Login from "./pages/Login";
import FourOFour from "./pages/FourOFour";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
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
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
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
