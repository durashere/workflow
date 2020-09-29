import React from "react";
import { TableRow, TableCell, Button } from "@material-ui/core";

const Toner = ({ user, onDelete }) => {
  return (
    <TableRow>
      <TableCell>{user.firstName + " " + user.lastName}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          type="button"
          onClick={() => onDelete(user)}
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Toner;
