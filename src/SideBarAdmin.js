import React, { useContext } from "react";

import { Link } from "react-router-dom";

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";

import DashboardIcon from "@material-ui/icons/Dashboard";
import CreateIcon from "@material-ui/icons/Create";
import AssignmentIcon from "@material-ui/icons/Assignment";

import Divider from "@material-ui/core/Divider";

import { AuthContext } from "./context/AuthContext";

const SideBar = () => {
  const auth = useContext(AuthContext);

  function ListItemLink(props) {
    return <ListItem button component={Link} {...props} />;
  }

  return (
    <div>
      <div>
        <ListItemLink to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemLink>
      </div>
      <Divider />
      <div>
        <ListSubheader>Toners</ListSubheader>

        <ListItemLink to="/toners">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Toners" />
        </ListItemLink>
      </div>
      <Divider />
      <div>
        <ListSubheader>Tools</ListSubheader>

        <ListItemLink to="/tools/cmshelper">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="CMS Helper" />
        </ListItemLink>

        <ListItemLink to="/tools/templates">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Templates" />
        </ListItemLink>
      </div>
      {auth.authState.userInfo.role === "admin" ? (
        <div>
          <Divider />
          <ListSubheader>Admin</ListSubheader>

          <ListItemLink to="/admin/users">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemLink>

          <ListItemLink to="/admin/toners">
            <ListItemIcon>
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary="Toners" />
          </ListItemLink>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SideBar;
