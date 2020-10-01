import React, { useState, useEffect, useContext } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";

import { FetchContext } from "../context/FetchContext";
import useSnackbars from "../hooks/useSnackbars";

import Toner from "./Toner";

const TonerList = () => {
  const fetchContext = useContext(FetchContext);
  const { addAlert } = useSnackbars();

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
        console.log("the error", error);
      }
    };

    getToners();
  }, [fetchContext]);

  const onDelete = async (toner) => {
    try {
      const { data } = await fetchContext.authAxios.delete(
        `toners/${toner.id}`,
        toner,
      );
      setToners(toners.filter((toner) => toner.id !== data.deletedToner.id));

      addAlert(data.message, "success");
    } catch (error) {
      const { data } = error.response;

      addAlert(data.message, "error");
    }
  };

  const onAdd = async (toner) => {
    try {
      const addedToner = {
        ...toner,
        amount: toner.amount + 1,
      };
      const { data } = await fetchContext.authAxios.put(
        `toners/${toner.id}`,
        addedToner,
      );

      setToners(
        toners.map((toner) =>
          toner.id === addedToner.id ? addedToner : toner,
        ),
      );

      addAlert(data.message, "success");
    } catch (error) {
      const { data } = error.response;

      addAlert(data.message, "error");
    }
  };

  const onSub = async (toner) => {
    try {
      const addedToner = {
        ...toner,
        amount: toner.amount - 1,
      };
      const { data } = await fetchContext.authAxios.put(
        `toners/${toner.id}`,
        addedToner,
      );
      setToners(
        toners.map((toner) =>
          toner.id === addedToner.id ? addedToner : toner,
        ),
      );

      addAlert(data.message, "success");
    } catch (error) {
      const { data } = error.response;

      addAlert(data.message, "error");
    }
  };

  return (
    <>
      {isLoading && <LinearProgress />}
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
            <Toner
              key={toner.id}
              toner={toner}
              onDelete={onDelete}
              onAdd={onAdd}
              onSub={onSub}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TonerList;
