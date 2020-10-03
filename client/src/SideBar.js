import React from "react";

import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";

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

const SideBar = () => {
  const classes = useStyles();
  const [openSettingsToners, setOpenSettingsToners] = React.useState(true);
  const [openSettingsUsers, setOpenSettingsUsers] = React.useState(true);

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
      </div>
      {/* {window.localStorage.getItem("user").userInfo.role === "admin" ? ( */}
      <div>
        <Divider />
        <ListSubheader>Admin</ListSubheader>

        <ListItemLink to="/admin/toners">
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="Toners" />
        </ListItemLink>

        <ListItemLink to="/admin/users">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="List users" />
        </ListItemLink>
      </div>
      {/* ) : (<></>
      )} */}
    </div>
  );
};
export default SideBar;
