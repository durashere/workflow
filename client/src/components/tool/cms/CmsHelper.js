import React, { useState } from "react";
import { makeStyles, Grid, Box, TextField } from "@material-ui/core";

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
  cmsView: {
    width: "100%",
  },
}));

export default function CmsHelperForm() {
  const classes = useStyles();
  const [cmsName, setCmsName] = useState("[CMS]");
  const [cmsLogin, setCmsLogin] = useState("[Login]");
  const [cmsPassword, setCmsPassword] = useState("[Password]");
  const [cmsLink, setCmsLink] = useState("[Link]");

  const result = `(Dostęp do ${cmsName})
Login: ${cmsLogin}
Password: ${cmsPassword}
Link: ${cmsLink}

Pozdrawiam / Best regards
Krzysztof Durek
  `;

  const handleCmsChange = (event, value) => {
    if (value !== null) {
      setCmsName(value.name);
      setCmsLink(value.link);
    } else {
      setCmsName("[CMS]");
      setCmsLink("[Link]");
    }
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
                label="Password"
                variant="outlined"
                onChange={({ target }) => setCmsPassword(target.value)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs>
          <TextField
            className={classes.cmsView}
            label="View"
            multiline
            rows={10}
            value={result}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </div>
  );
}
