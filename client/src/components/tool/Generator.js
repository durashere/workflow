import React, { useState } from "react";
import { TextField, TextareaAutosize } from "@material-ui/core";

const Generator = () => {
  const [cms, setCms] = useState("[Typ CMS]");
  const [cmsLogin, setCmsLogin] = useState("[Login]");
  const [cmsPassword, setCmsPassword] = useState("[Password]");
  const [cmsLink, setCmsLink] = useState("[Link]");

  const result = `(Dostęp do ${cms})
Login: ${cmsLogin}
Password: ${cmsPassword}
Link: ${cmsLink}

Pozdrawiam / Best regards
Krzysztof Durek
  `;

  return (
    <div>
      <div>
        <TextField
          label="Typ CMS"
          variant="outlined"
          onChange={({ target }) => setCms(target.value)}
        />
        <br />
        <TextField
          label="Login"
          variant="outlined"
          onChange={({ target }) => setCmsLogin(target.value)}
        />
        <br />
        <TextField
          label="Password"
          variant="outlined"
          onChange={({ target }) => setCmsPassword(target.value)}
        />
      </div>
      <div>
        <TextareaAutosize cols={60} rows={10} value={result} />
      </div>
    </div>
  );
};

export default Generator;
