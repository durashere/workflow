import React, { useContext, useEffect, useState } from "react";

import { useSnackbar } from "notistack";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { FetchContext } from "../context/FetchContext";

const Dashboard = () => {
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
    <div>
      <Autocomplete
        id="combo-box-demo"
        options={toners}
        getOptionLabel={(option) => option.code}
        style={{ width: 300 }}
        renderInput={(params) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <TextField {...params} label="Combo box" variant="outlined" />
        )}
      />
    </div>
  );
};

export default Dashboard;
