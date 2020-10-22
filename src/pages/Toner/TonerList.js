/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext } from "react";
import { useSnackbar } from "notistack";
import moment from "moment";
import MaterialTable from "material-table";

import LinearProgress from "@material-ui/core/LinearProgress";

import { FetchContext } from "../../context/FetchContext";
import { AuthContext } from "../../context/AuthContext";

const TonerListAdmin = () => {
  const fetchContext = useContext(FetchContext);
  const auth = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

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
        enqueueSnackbar(data.message, {
          variant: "error",
        });
      }
    };

    getToners();
  }, [fetchContext, enqueueSnackbar]);

  const onSub = async (toner) => {
    try {
      const { amount, logs, ...restToner } = toner;

      const newTonerLog = {
        log_user: `${auth.authState.userInfo.firstName} ${auth.authState.userInfo.lastName}`,
        log_time: new Date(),
      };

      logs.push(newTonerLog);

      const addedToner = {
        amount: amount - 1,
        logs,
        ...restToner,
      };

      const { data } = await fetchContext.authAxios.put(
        `toners/${toner._id}`,
        addedToner,
      );

      setToners(
        toners.map((toner) =>
          toner._id === data.toner._id ? data.toner : toner,
        ),
      );

      enqueueSnackbar(data.message, {
        variant: "success",
      });
    } catch (error) {
      const { data } = error.response;

      enqueueSnackbar(data.message, {
        variant: "error",
      });
    }
  };

  return (
    <>
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
                      title: "Usage history",
                      field: "log_time",
                      render: (rowData) => {
                        return moment(rowData.log_time).format(
                          "HH:mm, DD.MM.YYYY",
                        );
                      },
                      defaultSort: "desc",
                    },
                  ]}
                  data={rowData.logs}
                  options={{
                    toolbar: false,
                  }}
                />
              );
            },
          },
        ]}
      />
      {isLoading && <LinearProgress />}
    </>
  );
};

export default TonerListAdmin;
