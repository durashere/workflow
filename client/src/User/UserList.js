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

import User from "./User";

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
        console.log(data.message);
      }
    };
    getUsers();
  }, [fetchContext.authAxios]);

  const onDelete = async (user) => {
    try {
      const { data } = await fetchContext.authAxios.delete(
        `users/${user.id}`,
        user,
      );
      setUsers(users.filter((user) => user.id !== data.deletedUser.id));

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
            <TableCell>Full Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="right">Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <User key={user.id} user={user} onDelete={onDelete} />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default UserList;
