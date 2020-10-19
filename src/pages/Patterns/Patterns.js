import React from "react";
import PropTypes from "prop-types";

import { makeStyles, Box, Tabs, Tab } from "@material-ui/core";

import LaptopService from "./LaptopService";
import CmsHelper from "./CmsHelper";

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      style={{ width: "100%", paddingRight: "20px" }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
    >
      {value === index && <Box p={4}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    height: "100%",
  },
  tabs: {
    width: "200px",
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const Patterns = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        className={classes.tabs}
      >
        <Tab label="CMS Helper" />
        <Tab label="Laptop Service" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <CmsHelper />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <LaptopService />
      </TabPanel>
    </div>
  );
};

export default Patterns;
