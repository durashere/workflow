import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import clsx from "clsx";
import { makeStyles, Typography, CssBaseline } from "@material-ui/core";
import { Box, Container, Grid, Paper } from "@material-ui/core";
import {
  Drawer,
  Toolbar,
  AppBar,
  MenuItem,
  Menu,
  IconButton,
} from "@material-ui/core";
import {
  AccountCircle,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@material-ui/icons";

import MainDrawer from "./MainDrawer";
import Dashboard from "./Dashboard";
import UserList from "./user/UserList";
import UserForm from "./user/UserForm";
import TonerList from "./toner/TonerList";
import TonerForm from "./toner/TonerForm";
import CmsHelper from "./tool/cms/CmsHelper";
import Copyright from "./Copyright";

import tonerService from "../services/tonerService";

import { logoutUser } from "../reducers/currentUserReducer";
import { initToners } from "../reducers/tonerReducer";
import { initUsers } from "../reducers/userReducer";

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

// COMPONENT

export default function Main() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    dispatch(initToners());
    dispatch(initUsers());
  }, [dispatch]);

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem("user");
    tonerService.setToken(null);

    dispatch(logoutUser());
  };

  //   const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden,
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            />
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={() => setOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <MainDrawer />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <Route path="/toners/list">
                <Paper>
                  <TonerList />
                </Paper>
              </Route>
              <Route path="/tools/cmshelper">
                <Paper>
                  <CmsHelper />
                </Paper>
              </Route>
              {currentUser.usergroup === "admin" ? (
                <>
                  <Route path="/admin/users/list">
                    <Paper>
                      <UserList />
                    </Paper>
                  </Route>

                  <Route path="/admin/toners/create">
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper className={classes.paper}>
                          <TonerForm />
                        </Paper>
                      </Grid>
                    </Grid>
                  </Route>

                  <Route path="/admin/users/create">
                    <Grid container spacing={3}>
                      <Grid item xs={3}>
                        <Paper className={classes.paper}>
                          <UserForm />
                        </Paper>
                      </Grid>
                    </Grid>
                  </Route>
                </>
              ) : (
                <Redirect to="/" />
              )}

              <Route path="/">
                <Dashboard />
              </Route>
            </Switch>

            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}
