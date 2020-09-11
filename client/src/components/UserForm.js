import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField, MenuItem } from "@material-ui/core";

import { createUser } from "../reducers/userReducer";

const UserForm = () => {
  const dispatch = useDispatch();
  const [usergroup, setUsergroup] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const groups = [
    {
      value: "admin",
      label: "Admin",
    },
    {
      value: "user",
      label: "User",
    },
  ];

  const addUser = async (event) => {
    event.preventDefault();

    const userObject = {
      usergroup,
      username,
      password,
    };

    dispatch(createUser(userObject));

    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <form onSubmit={addUser}>
        <div>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="usergroup"
            label="Usergroup"
            name="usergroup"
            value={usergroup}
            onChange={(e) => setUsergroup(e.target.value)}
            select
          >
            {groups.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
          />
          <Button fullWidth type="submit" variant="outlined" color="primary">
            create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
