import React from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import DashboardIcon from "@material-ui/icons/Dashboard";
import CreateIcon from "@material-ui/icons/Create";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SettingsIcon from "@material-ui/icons/Settings";

import Collapse from "@material-ui/core/Collapse";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const MainDrawer = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const classes = useStyles();
  const [openSettingsToners, setOpenSettingsToners] = React.useState(true);
  const [openSettingsUsers, setOpenSettingsUsers] = React.useState(true);

  function ListItemLink(props) {
    return <ListItem button component={Link} {...props} />;
  }

  return (
    <div>
      <div>
        <ListItemLink to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemLink>
      </div>
      <Divider />
      <div>
        <ListSubheader>Toners</ListSubheader>
        <ListItemLink to="/toners/list">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Toners" />
        </ListItemLink>
      </div>
      {currentUser.usergroup === "admin" ? (
        <div>
          <ListSubheader>Admin</ListSubheader>

          <Divider />

          <ListItem
            button
            onClick={() => setOpenSettingsToners(!openSettingsToners)}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Toners" />
            {openSettingsToners ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={openSettingsToners} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemLink
                to="/admin/toners/create"
                className={classes.nested}
              >
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary="Create toner" />
              </ListItemLink>
            </List>
          </Collapse>

          <ListItem
            button
            onClick={() => setOpenSettingsUsers(!openSettingsUsers)}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
            {openSettingsUsers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={openSettingsUsers} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemLink to="/admin/users/list" className={classes.nested}>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="List users" />
              </ListItemLink>

              <ListItemLink to="/admin/users/create" className={classes.nested}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary="Create user" />
              </ListItemLink>
            </List>
          </Collapse>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MainDrawer;
