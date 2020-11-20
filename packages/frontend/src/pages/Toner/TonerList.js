/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext } from "react";
import { useSnackbar } from "notistack";
import moment from "moment";
import MaterialTable from "material-table";

import LinearProgress from "@material-ui/core/LinearProgress";
import { Paper } from "@material-ui/core";

import { FetchContext } from "../../context/FetchContext";

const TonerListAdmin = () => {
  const fetchContext = useContext(FetchContext);
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

  return (
    <Paper>
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
        detailPanel={[
          {
            icon: "history_outlined",
            openIcon: "update_outlined",
            tooltip: "Show history",
            render: (rowData) => {
              return (
                <MaterialTable
                  columns={[
                    {
                      title: "Changed",
                      field: "changeType",
                      render: (rowData) => {
                        if (rowData.changeType >= 0) {
                          return `+${rowData.changeType}`;
                        }
                        if (rowData.changeType <= 0) {
                          return `${rowData.changeType}`;
                        }
                      },
                      sorting: false,
                    },
                    {
                      title: "Amount Change",
                      render: (rowData) => {
                        return `${rowData.amountBefore} → ${rowData.amountAfter}`;
                      },
                      sorting: false,
                    },
                    { title: "User", field: "user", sorting: false },
                    {
                      title: "Date",
                      field: "date",
                      render: (rowData) => {
                        return moment(rowData.date).format("HH:mm, DD.MM.YYYY");
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
    </Paper>
  );
};

export default TonerListAdmin;
