import React from "react";
import { useDispatch } from "react-redux";
import { TableRow, TableCell, Button } from "@material-ui/core";

import { removeUser } from "../reducers/userReducer";

const Toner = ({ user }) => {
  const dispatch = useDispatch();

  const handleRemoveUser = () => {
    dispatch(removeUser(user));
  };

  return (
    <TableRow>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.usergroup}</TableCell>
      <TableCell align="right">
        <Button variant="contained" type="button" onClick={handleRemoveUser}>
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Toner;
