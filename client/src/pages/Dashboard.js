import React, { useContext, useEffect, useState } from "react";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { FetchContext } from "../context/FetchContext";

const Dashboard = () => {
  const fetchContext = useContext(FetchContext);
  const [toners, setToners] = useState([]);

  useEffect(() => {
    const getToners = async () => {
      try {
        const { data } = await fetchContext.authAxios.get("toners");
        setToners(data);
      } catch (error) {
        console.log("the error", error);
      }
    };

    getToners();
  }, [fetchContext]);

  return (
    <div>
      <Autocomplete
        id="combo-box-demo"
        options={toners}
        getOptionLabel={(option) => option.code}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Combo box" variant="outlined" />
        )}
      />
    </div>
  );
};

export default Dashboard;
