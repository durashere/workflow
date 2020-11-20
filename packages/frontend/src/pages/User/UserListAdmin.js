/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext } from "react";
import MaterialTable from "material-table";

import { useSnackbar } from "notistack";

import LinearProgress from "@material-ui/core/LinearProgress";
import { Paper } from "@material-ui/core";

import { FetchContext } from "../../context/FetchContext";

const UserList = () => {
  const fetchContext = useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    const getUsers = async () => {
      try {
        setIsLoading(true);
        const { data } = await fetchContext.authAxios.get("users");
        setUsers(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        const { data } = error.response;
        enqueueSnackbar(data.message, {
          variant: "error",
        });
      }
    };
    getUsers();
  }, [fetchContext, enqueueSnackbar]);

  const onCreate = async (newUser) => {
    try {
      setIsLoading(true);
      const { data } = await fetchContext.authAxios.post("users", newUser);
      setIsLoading(false);

      setUsers([...users, newUser]);
      enqueueSnackbar(data.message, {
        variant: "success",
      });
    } catch (error) {
      setIsLoading(false);
      const { data } = error.response;
      enqueueSnackbar(data.message, {
        variant: "error",
      });
    }
  };

  const onUpdate = async (newUser) => {
    try {
      const updatedUser = {
        ...newUser,
      };

      const { data } = await fetchContext.authAxios.put(
        `users/${newUser._id}`,
        updatedUser,
      );

      setUsers(
        users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user,
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

  const onDelete = async (user) => {
    try {
      const { data } = await fetchContext.authAxios.delete(
        `users/${user._id}`,
        user,
      );
      setUsers(users.filter((user) => user._id !== data.deletedUser._id));

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
    <Paper>
      <MaterialTable
        style={{ padding: 10 }}
        columns={[
          {
            title: "Username",
            field: "username",
          },
          {
            title: "First Name",
            field: "firstName",
          },
          {
            title: "Last Name",
            field: "lastName",
          },
          {
            title: "Password",
            field: "password",
            render: () => "*****",
          },
          // {
          //   title: "Full Name",
          //   render: (rowData) => `${rowData.firstName} ${rowData.lastName}`,
          // },
          {
            title: "Role",
            field: "role",
            lookup: {
              user: "user",
              admin: "admin",
            },
          },
        ]}
        data={users}
        title="Users List"
        options={{ paging: false }}
        editable={{
          onRowAdd: (newUser) => onCreate(newUser),
          onRowUpdate: (newData) => onUpdate(newData),
          onRowDelete: (user) => onDelete(user),
        }}
        localization={{
          body: {
            editRow: {
              deleteText: "Are you sure you want to delete this user?",
            },
          },
        }}
      />
      {isLoading && <LinearProgress />}
    </Paper>
  );
};

export default UserList;
