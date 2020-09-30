import React, { lazy, Suspense, useEffect, useContext } from "react";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { FetchProvider } from "./context/FetchContext";
import { SnackbarProvider } from "./context/SnackbarContext";

import AppShell from "./AppShell";

import Login from "./components/Login";
import FourOFour from "./components/FourOFour";

const Dashboard = lazy(() => import("./components/Dashboard"));
const UserList = lazy(() => import("./components/user/UserList"));
const UserForm = lazy(() => import("./components/user/UserForm"));
const TonerList = lazy(() => import("./components/toner/TonerList"));
const TonerForm = lazy(() => import("./components/toner/TonerForm"));
const CmsHelper = lazy(() => import("./components/tool/cms/CmsHelper"));

function App() {
  const LoadingFallback = () => (
    <AppShell>
      <div>Loading...</div>
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

  const AuthenticatedRoute = ({ children, ...rest }) => {
    const auth = useContext(AuthContext);
    return (
      <Route
        {...rest}
        render={() =>
          auth.isAuthenticated() ? (
            <AppShell>{children}</AppShell>
          ) : (
            <Redirect to="/login" />
          )
        }
      ></Route>
    );
  };

  const AdminRoute = ({ children, ...rest }) => {
    const auth = useContext(AuthContext);
    return (
      <Route
        {...rest}
        render={() =>
          auth.isAuthenticated() && auth.isAdmin() ? (
            <AppShell>{children}</AppShell>
          ) : (
            <Redirect to="/login" />
          )
        }
      ></Route>
    );
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
                return auth.isAuthenticated ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Redirect to="/login" />
                );
              }}
            ></Route>
            <AuthenticatedRoute path="/dashboard">
              <Dashboard />
            </AuthenticatedRoute>

            <AuthenticatedRoute path="/toners/list">
              <TonerList />
            </AuthenticatedRoute>

            <AuthenticatedRoute path="/tools/cmshelper">
              <CmsHelper />
            </AuthenticatedRoute>

            <AdminRoute path="/admin/users/list">
              <UserList />
            </AdminRoute>

            <AdminRoute path="/admin/users/create">
              <UserForm />
            </AdminRoute>

            <AdminRoute path="/admin/toners/create">
              <TonerForm />
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
}

export default App;
