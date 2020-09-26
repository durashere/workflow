import React, { useState } from "react";
// import { useSelector } from "react-redux";
import { makeStyles, Grid, Button, TextField } from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";

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
  cmsField: {
    width: "100%",
  },
  cmsMail: {
    width: "100%",
  },
}));

export default function CmsHelperForm() {
  const classes = useStyles();
  // const users = useSelector((state) => state.users);
  const [cmsName, setCmsName] = useState("");
  const [cmsLogin, setCmsLogin] = useState("");
  const [cmsLink, setCmsLink] = useState("");
  const [cmsPhone, setCmsPhone] = useState("");
  const [cmsPassword] = useState(Math.random().toString(20).substr(2, 12));

  // console.log(users.find((user) => user.username === currentUser.username));

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

  const copyToClipboard = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  const normalizePhone = (value) => {
    return value.replace(/[^\d]/g, "");
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Grid container direction={"column"} spacing={1}>
            <Grid item xs>
              <Autocomplete
                className={classes.cmsField}
                options={cmsList}
                getOptionLabel={(option) => option.name}
                onChange={handleCmsChange}
                renderInput={(params) => (
                  <TextField {...params} label="CMS" variant="outlined" />
                )}
              />
            </Grid>
            <Grid item xs>
              <TextField
                className={classes.cmsField}
                label="Login"
                variant="outlined"
                onChange={({ target }) => setCmsLogin(target.value)}
              />
            </Grid>
            <Grid item xs>
              <TextField
                className={classes.cmsField}
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
            </Grid>
            <Grid item xs>
              <Button
                className={classes.cmsField}
                variant="outlined"
                color="primary"
                onClick={() => copyToClipboard(cmsPassword)}
              >
                copy to clipboard
              </Button>
            </Grid>
            <Grid item xs>
              <TextField
                className={classes.cmsField}
                label="Phone"
                variant="outlined"
                onChange={({ target }) =>
                  setCmsPhone(normalizePhone(target.value))
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs>
          <Grid container direction={"column"} spacing={1}>
            <Grid item xs>
              <TextField
                className={classes.cmsMail}
                label="Preview"
                multiline
                rows={10}
                value={cmsMail}
                variant="outlined"
              />
            </Grid>
            <Grid item xs>
              <Button
                className={classes.cmsField}
                variant="outlined"
                color="primary"
                onClick={() =>
                  (window.location.href = `mailto:${`${cmsPhone}@sms.tvn.pl`}?body=${
                    encodeURIComponent(cmsMail) || ""
                  }`)
                }
              >
                send email
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
