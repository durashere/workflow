/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext } from "react";
import MaterialTable from "material-table";

import { useSnackbar } from "notistack";

import LinearProgress from "@material-ui/core/LinearProgress";
import { Paper } from "@material-ui/core";

import { FetchContext } from "../../context/FetchContext";

const TonerListAdmin = () => {
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

  return (
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
  );
};

export default TonerListAdmin;
