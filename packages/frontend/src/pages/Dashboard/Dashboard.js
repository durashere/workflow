import React, { useContext, useEffect, useState } from "react";

import QuickUse from "./QuickUse";
import TonersToOrder from "./TonersToOrder";

import { useSnackbar } from "notistack";

import { Box, Grid, Paper } from "@material-ui/core";

import { FetchContext } from "../../context/FetchContext";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  widgetTitle: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(0.1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  widgetContent: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    minHeight: 200,
  },
}));

const Widget = ({ children, title }) => {
  const classes = useStyles();

  return (
    <Box>
      <Paper className={classes.widgetTitle}>
        <b>{title}</b>
      </Paper>

      <Paper className={classes.widgetContent}>{children}</Paper>
    </Box>
  );
};

const Dashboard = () => {
  const classes = useStyles();
  const fetchContext = useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();

  const [toners, setToners] = useState([]);

  useEffect(() => {
    const getToners = async () => {
      try {
        const { data } = await fetchContext.authAxios.get("toners");
        setToners(data);
      } catch (error) {
        const { data } = error.response;
        enqueueSnackbar(data.message, {
          variant: "error",
        });
      }
    };

    getToners();
  }, [fetchContext, enqueueSnackbar]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Widget title="Qucik Use">
            <QuickUse toners={toners} setToners={setToners} />
          </Widget>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Widget title="Toners to order">
            <TonersToOrder toners={toners} setToners={setToners} />
          </Widget>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
