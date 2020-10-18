import React, { useState, useContext } from "react";
import { makeStyles, Button, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import copyToClipboard from "../../util/copyToClipboard";
import normalizePhone from "../../util/normalizePhone";
import { AuthContext } from "../../context/AuthContext";

const cmsList = [
  {
    name: "Google",
    link: "https://www.google.com/",
  },
  {
    name: "Facebook",
    link: "https://www.facebook.com/",
  },
  {
    name: "Twitter",
    link: "https://www.twitter.com/",
  },
];

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
  },
  inputsContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    "& > *": {
      flex: "auto",
      padding: theme.spacing(1),
    },
  },
  buttonsContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    "& > *": {
      flex: "auto",
      margin: theme.spacing(1),
    },
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const CmsHelper = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [name, setName] = useState("[CMS NAME]");
  const [login, setLogin] = useState("[LOGIN]");
  const [link, setLink] = useState("[CMS LINK]");
  const [phone, setPhone] = useState("[PHONE]");
  const [password] = useState(
    Math.random().toString(36).substr(2, 8) +
      Math.random().toString(36).substr(2, 8),
  );

  const pattern = `(Dostęp do ${name})

Login: ${login}
Password: ${password}

Link: ${link}

Pozdrawiam / Best regards
${auth.authState.userInfo.firstName} ${auth.authState.userInfo.lastName}
`;

  const handleCmsChange = (event, value) => {
    if (value !== null) {
      setName(value.name);
      setLink(value.link);
    } else {
      setName("[CMS NAME]");
      setLink("[CMS LINK]");
    }
  };

  return (
    <div className={classes.rootContainer}>
      <div className={classes.inputsContainer}>
        <Autocomplete
          options={cmsList}
          getOptionLabel={(option) => option.name}
          onChange={handleCmsChange}
          renderInput={(params) => (
            <TextField {...params} label="CMS" variant="outlined" />
          )}
        />

        <TextField
          label="Login"
          variant="outlined"
          onChange={({ target }) =>
            target.value !== ""
              ? setLogin(target.value)
              : setLogin("[CMS LOGIN]")
          }
        />

        <TextField
          label="Phone"
          variant="outlined"
          onChange={({ target }) => setPhone(normalizePhone(target.value))}
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Password"
          variant="outlined"
          value={password}
          onFocus={(event) => {
            event.target.select();
          }}
        />

        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          onClick={() => copyToClipboard(password)}
        >
          copy password
        </Button>
      </div>

      <div className={classes.inputsContainer}>
        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Pattern"
          multiline
          rows={10}
          value={pattern}
          variant="outlined"
        />
      </div>

      <div className={classes.buttonsContainer}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => copyToClipboard(pattern)}
        >
          copy pattern
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            (window.location.href = `mailto:${`${phone}@${process.env.REACT_APP_SMS_DOMAIN}`}?body=${
              encodeURIComponent(pattern) || ""
            }`)
          }
        >
          send email
        </Button>
      </div>
    </div>
  );
};

export default CmsHelper;
