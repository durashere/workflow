import React, { useState, useEffect, useContext } from "react";
import MaterialTable from "material-table";
import LinearProgress from "@material-ui/core/LinearProgress";

import { FetchContext } from "../context/FetchContext";
import useSnackbars from "../hooks/useSnackbars";

const TonerListAdmin = () => {
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

  const onCreate = async (newToner) => {
    try {
      setIsLoading(true);
      const { data } = await fetchContext.authAxios.post("toners", newToner);
      setIsLoading(false);

      setToners([...toners, newToner]);
      addAlert(data.message, "success");
    } catch (error) {
      setIsLoading(false);
      const { data } = error.response;

      addAlert(data.message, "error");
    }
  };

  const onUpdate = async (newToner) => {
    try {
      const { brand, model, color, amount } = newToner;

      const updatedToner = {
        ...newToner,
        brand,
        model,
        color,
        amount,
      };

      console.log(updatedToner);
      const { data } = await fetchContext.authAxios.put(
        `toners/${newToner.id}`,
        updatedToner,
      );

      setToners(
        toners.map((toner) =>
          toner.id === updatedToner.id ? updatedToner : toner,
        ),
      );

      addAlert(data.message, "success");
    } catch (error) {
      const { data } = error.response;

      addAlert(data.message, "error");
    }
  };

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

  return (
    <>
      {isLoading && <LinearProgress />}

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
          { title: "Model", field: "model" },
          {
            title: "Color",
            field: "color",
            lookup: {
              Black: "Black",
              Cyan: "Cyan",
              Yellow: "Yellow",
              Magenta: "Magenta",
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
      {/* <Table>
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
      </Table> */}
    </>
  );
};

export default TonerListAdmin;
