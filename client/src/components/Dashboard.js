import React from "react";
import { useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const Dashboard = () => {
  const toners = useSelector((state) => state.toners);

  return (
    <div>
      <Autocomplete
        id="combo-box-demo"
        options={toners}
        getOptionLabel={(option) => option.model}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Combo box" variant="outlined" />
        )}
      />
    </div>
  );
};

export default Dashboard;
