import React from "react";
import PropTypes from "prop-types";

import {
  makeStyles,
  Paper,
  Box,
  Tabs,
  Tab,
  LinearProgress,
} from "@material-ui/core";

import LaptopService from "./LaptopService";
import CmsHelper from "./CmsHelper";

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
  tabPanel: {
    width: "100%",
  },
}));

function TabPanel(props) {
  const classes = useStyles();

  const { children, value, index } = props;

  return (
    <div
      className={classes.tabPanel}
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

const Patterns = () => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper>
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
          <CmsHelper setIsLoading={setIsLoading} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <LaptopService />
        </TabPanel>
      </div>
      {isLoading && <LinearProgress />}
    </Paper>
  );
};

export default Patterns;
