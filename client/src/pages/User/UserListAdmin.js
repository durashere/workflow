import React, { useState, useEffect, useContext } from "react";
import MaterialTable from "material-table";

import LinearProgress from "@material-ui/core/LinearProgress";

import { FetchContext } from "../../context/FetchContext";
import useSnackbars from "../../hooks/useSnackbars";

const UserList = () => {
  const fetchContext = useContext(FetchContext);
  const { addAlert } = useSnackbars();

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
        addAlert(data.message, "error");
      }
    };
    getUsers();
  }, [fetchContext.authAxios]);

  const onCreate = async (newUser) => {
    try {
      setIsLoading(true);
      const { data } = await fetchContext.authAxios.post("users", newUser);
      setIsLoading(false);

      setUsers([...users, newUser]);
      addAlert(data.message, "success");
    } catch (error) {
      setIsLoading(false);
      const { data } = error.response;

      console.log("error: ", data.message);
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

      addAlert(data.message, "success");
    } catch (error) {
      const { data } = error.response;

      addAlert(data.message, "error");
    }
  };

  const onDelete = async (user) => {
    try {
      const { data } = await fetchContext.authAxios.delete(
        `users/${user._id}`,
        user,
      );
      setUsers(users.filter((user) => user._id !== data.deletedUser._id));

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
        columns={[
          {
            title: "First Name",
            field: "firstName",
          },
          {
            title: "Last Name",
            field: "lastName",
          },
          {
            title: "Username",
            field: "username",
          },
          {
            title: "Password",
            field: "password",
          },
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
    </>
  );
};

export default UserList;
