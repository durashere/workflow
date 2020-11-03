import React, { useState, useEffect, useContext } from "react";

import PropTypes from "prop-types";

import { useSnackbar } from "notistack";

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
import { FetchContext } from "../../context/FetchContext";
import { AuthContext } from "../../context/AuthContext";
import sendEmail from "../../util/sendEmail";

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

const CmsHelper = ({ setIsLoading }) => {
  const classes = useStyles();
  const fetchContext = useContext(FetchContext);
  const auth = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState("[CMS NAME]");
  const [login, setLogin] = useState("[CMS LOGIN]");
  const [link, setLink] = useState("[CMS LINK]");
  const [phone, setPhone] = useState("");
  const [password] = useState(
    Math.random().toString(36).substr(2, 8) +
      Math.random().toString(36).substr(2, 8),
  );

  const [cmss, setCmss] = useState([]);

  useEffect(() => {
    const getCmss = async () => {
      try {
        setIsLoading(true);
        const { data } = await fetchContext.authAxios.get("cmss");

        setCmss(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        const { data } = error.response;
        enqueueSnackbar(data.message, {
          variant: "error",
        });
      }
    };

    getCmss();
  }, [fetchContext, enqueueSnackbar, setIsLoading]);

  const pattern = `(Credentials to ${name})

Login: ${login}
Password: ${password}

Link: ${link}

Best regards
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
          options={cmss}
          getOptionLabel={(option) => option.name}
          onChange={handleCmsChange}
          renderInput={(params) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
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
              `Credentials to ${name}`,
              pattern,
              " ",
            )
          }
        >
          send email
        </Button>
      </div>
    </div>
  );
};

CmsHelper.propTypes = {
  setIsLoading: PropTypes.func.isRequired,
};

export default CmsHelper;
