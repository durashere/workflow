import React, { useContext, useState } from "react";

import { useSnackbar } from "notistack";

import {
  TextField,
  Grid,
  Box,
  Typography,
  ButtonBase,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { FetchContext } from "../../context/FetchContext";

import { makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
  },
  search: {
    width: "100%",
  },
  button: {
    margin: theme.spacing(1),
  },
  selectedToner: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: "100%",
  },
  image: {
    margin: theme.spacing(1),
    width: 256,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

const placeholderImage = "http://via.placeholder.com/256x128&text=NO%20IMAGE";

const SelectedTonerInfo = ({ selectedToner }) => {
  const classes = useStyles();

  return (
    <Box
      border={1}
      borderColor="grey.600"
      borderRadius={4}
      className={classes.selectedToner}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase className={classes.image}>
            <img
              className={classes.img}
              alt="toner"
              src={selectedToner.image ?? placeholderImage}
            />
          </ButtonBase>
        </Grid>
        <Grid
          item
          xs={12}
          sm
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Typography gutterBottom variant="h5">
            {selectedToner.brand} {selectedToner.code}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Amount: {selectedToner.amount}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Color: {selectedToner.color}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const QuickUse = ({ toners, setToners }) => {
  const classes = useStyles();
  const fetchContext = useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();

  const [selectedToner, setSelectedToner] = useState(null);

  const onSub = async (toner) => {
    try {
      const { data } = await fetchContext.authAxios.post(`tonerslogs`, {
        toner: toner,
        amountToChange: -1,
      });

      setToners(
        toners.map((toner) =>
          toner._id === data.toner._id ? data.toner : toner,
        ),
      );

      enqueueSnackbar(data.message, {
        variant: "success",
      });
    } catch (error) {
      const { data } = error.response;

      enqueueSnackbar(data.message, {
        variant: "error",
      });
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <Autocomplete
          options={toners}
          getOptionLabel={(option) => option.code}
          value={selectedToner}
          groupBy={(option) => option.brand}
          getOptionSelected={(option, value) => option.code === value.code}
          onChange={(event, value) => setSelectedToner(value)}
          renderInput={(params) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField {...params} label="Choose toner" variant="outlined" />
          )}
        />
      </div>
      {selectedToner && (
        <div className={classes.selectedToner}>
          <SelectedTonerInfo selectedToner={selectedToner} />
        </div>
      )}
      <div className={classes.button}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => onSub(selectedToner)}
        >
          use toner
        </Button>
      </div>
    </div>
  );
};

export default QuickUse;
