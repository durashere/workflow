/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import MaterialTable from "material-table";
import LinearProgress from "@material-ui/core/LinearProgress";

import { FetchContext } from "../../context/FetchContext";
import { AuthContext } from "../../context/AuthContext";
import useSnackbars from "../../hooks/useSnackbars";

const TonerListAdmin = () => {
  const fetchContext = useContext(FetchContext);
  const auth = useContext(AuthContext);
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
        console.log(data.message);
        // addAlert(data.message, "error");
      }
    };

    getToners();
  }, [fetchContext]);

  const onSub = async (toner) => {
    try {
      const { amount, logs, ...restToner } = toner;

      const newTonerLog = {
        log_user: `${auth.authState.userInfo.firstName} ${auth.authState.userInfo.lastName}`,
        log_time: new Date(),
      };

      logs.push(newTonerLog);

      console.log("newLogs", logs);

      const addedToner = {
        amount: amount - 1,
        logs,
        ...restToner,
      };

      console.log("addded", addedToner);

      const { data } = await fetchContext.authAxios.put(
        `toners/${toner._id}`,
        addedToner,
      );

      setToners(
        toners.map((toner) =>
          toner._id === data.toner._id ? data.toner : toner,
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
            icon: "remove_outlined",
            tooltip: "Use Toner",
            onClick: (event, rowData) => onSub(rowData),
          },
        ]}
        detailPanel={[
          {
            icon: "history_outlined",
            openIcon: "update_outlined",
            tooltip: "Show history",
            render: (rowData) => {
              return (
                <MaterialTable
                  columns={[
                    { title: "User", field: "log_user" },
                    {
                      title: "Use history",
                      field: "log_time",
                      render: (rowData) => {
                        return moment(rowData.log_time).format(
                          "HH:mm | DD.MM.YYYY",
                        );
                      },
                      defaultSort: "desc",
                    },
                  ]}
                  data={rowData.logs}
                  title="Use history"
                  options={{
                    toolbar: false,
                  }}
                />
              );
            },
          },
        ]}
      />
    </>
  );
};

export default TonerListAdmin;
