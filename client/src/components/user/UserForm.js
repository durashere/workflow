import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField, MenuItem } from "@material-ui/core";

import { createUser } from "../../reducers/userReducer";

const UserForm = () => {
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      role,
      username,
      firstName,
      lastName,
      password,
    };

    dispatch(createUser(userObject));

    setUsername("");
    setFirstName("");
    setLastName("");
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
            id="role"
            label="Role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
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
            id="firstName"
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
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
