import React, { useState, useContext } from "react";
import {
  makeStyles,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { FileCopy as FileCopyIcon } from "@material-ui/icons";

import copyToClipboard from "../../util/copyToClipboard";
import normalizePhone from "../../util/normalizePhone";
import { AuthContext } from "../../context/AuthContext";
import sendEmail from "../../util/sendEmail";

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
  patternContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    flex: "auto",
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
  const [login, setLogin] = useState("[CMS LOGIN]");
  const [link, setLink] = useState("[CMS LINK]");
  const [phone, setPhone] = useState("");
  const [password] = useState(
    Math.random().toString(36).substr(2, 8) +
      Math.random().toString(36).substr(2, 8),
  );

  const pattern = `(Dostęp do ${name})

Login: ${login}
Password: ${password}

Link: ${link}

Pozdrawiam / Best regards
${auth.authState.userInfo.firstName} ${auth.authState.userInfo.lastName}`;

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
            <TextField {...params} label="Choose CMS" variant="outlined" />
          )}
        />

        <TextField
          label="Phone"
          variant="outlined"
          onChange={({ target }) => setPhone(normalizePhone(target.value))}
        />
      </div>
      <div className={classes.inputsContainer}>
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => copyToClipboard(password)}>
                  <FileCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
            readOnly: true,
          }}
          label="Password"
          variant="outlined"
          value={password}
          onFocus={(event) => {
            event.target.select();
          }}
        />
      </div>

      <div className={classes.patternContainer}>
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
            sendEmail(
              `${phone}${process.env.REACT_APP_SMS_DOMAIN}`,
              `Dane do logowania ${name}`,
              pattern,
            )
          }
        >
          send email
        </Button>
      </div>
    </div>
  );
};

export default CmsHelper;
