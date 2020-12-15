/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext } from "react";
import MaterialTable from "material-table";

import { useSnackbar } from "notistack";

import LinearProgress from "@material-ui/core/LinearProgress";
import { Paper } from "@material-ui/core";

import { FetchContext } from "../../context/FetchContext";

import { makeStyles, Button } from "@material-ui/core";

import {
  TextField,
  Grid,
  Box,
  Typography,
  ButtonBase,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

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

const TonerListAdmin = () => {
  const classes = useStyles();

  const [selectedToner, setSelectedToner] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState();

  const fetchContext = useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();

  const [toners, setToners] = useState([]);
  const [isLoading, setIsLoading] = useState();

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

  const onCreate = async (newToner) => {
    try {
      setIsLoading(true);
      const { data } = await fetchContext.authAxios.post("toners", newToner);
      setIsLoading(false);

      setToners([...toners, newToner]);
      enqueueSnackbar(data.message, {
        variant: "success",
      });
    } catch (error) {
      setIsLoading(false);
      const { data } = error.response;

      enqueueSnackbar(data.message, {
        variant: "error",
      });
    }
  };

  const onUpdate = async (newToner) => {
    try {
      const updatedToner = {
        ...newToner,
      };

      const { data } = await fetchContext.authAxios.put(
        `toners/${newToner._id}`,
        updatedToner,
      );

      setToners(
        toners.map((toner) =>
          toner._id === updatedToner._id ? updatedToner : toner,
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

  const onDelete = async (toner) => {
    try {
      const { data } = await fetchContext.authAxios.delete(
        `toners/${toner._id}`,
        toner,
      );
      setToners(toners.filter((toner) => toner._id !== data.deletedToner._id));

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

  const onAdd = async (toner) => {
    try {
      const { data } = await fetchContext.authAxios.post(`tonerslogs`, {
        toner: toner,
        amountToChange: amountToAdd,
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
    <div>
      <Paper>
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
                <TextField
                  {...params}
                  label="Choose toner"
                  variant="outlined"
                />
              )}
            />
          </div>
          {selectedToner && (
            <div>
              <TextField
                onChange={(e) => setAmountToAdd(e.target.value)}
                label="Amount to add"
                variant="outlined"
              />
            </div>
          )}
          <div className={classes.button}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onAdd(selectedToner)}
            >
              use toner
            </Button>
          </div>
        </div>
      </Paper>
      <Paper>
        <MaterialTable
          style={{ padding: 10 }}
          columns={[
            {
              title: "Brand",
              field: "brand",
              lookup: {
                Xerox: "Xerox",
                HP: "HP",
              },
            },
            { title: "Supply Code", field: "code" },
            {
              title: "Color",
              field: "color",
              lookup: {
                Black: "Black",
                Cyan: "Cyan",
                Magenta: "Magenta",
                Yellow: "Yellow",
              },
            },
            {
              title: "Amount",
              field: "amount",
              initialEditValue: 0,
            },
          ]}
          data={toners}
          title="Toners List"
          options={{ paging: false }}
          editable={{
            onRowAdd: (newToner) => onCreate(newToner),
            onRowUpdate: (newData) => onUpdate(newData),
            onRowDelete: (toner) => onDelete(toner),
          }}
          localization={{
            body: {
              editRow: {
                deleteText: "Are you sure you want to delete this toner?",
              },
            },
          }}
        />
        {isLoading && <LinearProgress />}
      </Paper>
    </div>
  );
};

export default TonerListAdmin;
