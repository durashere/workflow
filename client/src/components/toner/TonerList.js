import React from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import Toner from "./Toner";

const TonerList = () => {
  const toners = useSelector((state) => state.toners);

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Model</TableCell>
            <TableCell align="center">Amount</TableCell>
            <TableCell align="right">Add / Sub</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {toners.map((toner) => (
            <Toner key={toner.id} toner={toner} />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TonerList;
