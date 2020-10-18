import React, { useState } from "react";
import { makeStyles, Button, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import copyToClipboard from "../../util/copyToClipboard";
import normalizePhone from "../../util/normalizePhone";

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
  const [cmsName, setCmsName] = useState("");
  const [cmsLogin, setCmsLogin] = useState("");
  const [cmsLink, setCmsLink] = useState("");
  const [cmsPhone, setCmsPhone] = useState("");
  const [cmsPassword] = useState(Math.random().toString(20).substr(2, 12));

  const cmsMail = `(Dostęp do ${cmsName})
Login: ${cmsLogin}
Password: ${cmsPassword}
Link: ${cmsLink}
${cmsPhone}
Pozdrawiam / Best regards
Krzysztof
`;

  const handleCmsChange = (event, value) => {
    if (value !== null) {
      setCmsName(value.name);
      setCmsLink(value.link);
    } else {
      setCmsName("");
      setCmsLink("");
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
          onChange={({ target }) => setCmsLogin(target.value)}
        />

        <TextField
          label="Phone"
          variant="outlined"
          onChange={({ target }) => setCmsPhone(normalizePhone(target.value))}
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Password"
          variant="outlined"
          value={cmsPassword}
          onFocus={(event) => {
            event.target.select();
          }}
        />

        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          onClick={() => copyToClipboard(cmsPassword)}
        >
          copy to clipboard
        </Button>
      </div>

      <div className={classes.inputsContainer}>
        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Preview"
          multiline
          rows={10}
          value={cmsMail}
          variant="outlined"
        />
      </div>

      <div className={classes.buttonsContainer}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            (window.location.href = `mailto:${`${cmsPhone}@${process.env.REACT_APP_SMS_DOMAIN}`}?body=${
              encodeURIComponent(cmsMail) || ""
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
