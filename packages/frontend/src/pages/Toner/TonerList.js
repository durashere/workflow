/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext } from "react";

import { useSnackbar } from "notistack";

import { TextField, Grid, Box, Typography } from "@material-ui/core";

import LinearProgress from "@material-ui/core/LinearProgress";
import { Paper } from "@material-ui/core";

import { FetchContext } from "../../context/FetchContext";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  search: {
    padding: theme.spacing(1),
    textAlign: "center",
  },
  element: {
    whiteSpace: "nowrap",
    flex: "0 0 47%",
    margin: theme.spacing(1),
    padding: theme.spacing(3),
  },
}));

const TonerList = () => {
  const classes = useStyles();

  const fetchContext = useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();

  const [toners, setToners] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const getToners = async () => {
      try {
        setIsLoading(true);
        const { data } = await fetchContext.authAxios.get("toners");

        setToners(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        const { data } = error.response;
        enqueueSnackbar(data.message, {
          variant: "error",
        });
      }
    };

    getToners();
  }, [fetchContext, enqueueSnackbar]);

  return (
    <div>
      <div className={classes.search}>
        <TextField
          fullWidth
          value={filter}
          label="Search"
          variant="outlined"
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>
      <div className={classes.root}>
        {toners
          .filter((toner) => toner.code.toLowerCase().includes(filter))
          .map((toner) => (
            <Paper key={toner._id} className={classes.element}>
              <Grid
                item
                xs={12}
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={2}
              >
                <Typography variant="h5" gutterBottom>
                  {toner.brand} {toner.code}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  Color: {toner.color}
                </Typography>

                <Typography variant="subtitle1">
                  Amount: {toner.amount}
                </Typography>
              </Grid>
            </Paper>
          ))}
      </div>
      {isLoading && <LinearProgress />}
    </div>
  );
};

export default TonerList;
