import React, { useState, useEffect, useContext } from "react";
import MaterialTable from "material-table";
import LinearProgress from "@material-ui/core/LinearProgress";

import { FetchContext } from "../../context/FetchContext";
import useSnackbars from "../../hooks/useSnackbars";

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
        const { data } = error.response;
        addAlert(data.message, "error");
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
        `toners/${toner._id}`,
        addedToner,
      );

      setToners(
        toners.map((toner) =>
          toner._id === addedToner._id ? addedToner : toner,
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
        `toners/${toner._id}`,
        addedToner,
      );
      setToners(
        toners.map((toner) =>
          toner._id === addedToner._id ? addedToner : toner,
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
            editable: "never",
          },
          { title: "Supply Code", field: "code", editable: "never" },
          {
            title: "Color",
            field: "color",
            lookup: {
              Black: "Black",
              Cyan: "Cyan",
              Yellow: "Yellow",
              Magenta: "Magenta",
            },
            editable: "never",
          },
          {
            title: "Amount",
            field: "amount",
            type: "numeric",
            initialEditValue: 0,
          },
        ]}
        data={toners}
        title="Toners List"
        options={{ paging: false, grouping: true }}
        actions={[
          {
            icon: "remove",
            tooltip: "Use Toner",
            onClick: (event, rowData) => onSub(rowData),
          },
        ]}
      />
    </>
  );
};

export default TonerListAdmin;
