import React from "react";

import { TableRow, TableCell, Button } from "@material-ui/core";

const Toner = ({ toner, onDelete, onAdd, onSub }) => {
  return (
    <TableRow>
      <TableCell>{toner.code}</TableCell>
      <TableCell align="center">{toner.amount}</TableCell>
      <TableCell align="right">
        <Button variant="contained" type="button" onClick={() => onSub(toner)}>
          -
        </Button>

        <Button variant="contained" type="button" onClick={() => onAdd(toner)}>
          +
        </Button>
        <Button
          variant="contained"
          type="button"
          onClick={() => onDelete(toner)}
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Toner;
