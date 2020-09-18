import React, { useState } from "react";
import {
  Select,
  MenuItem,
  TextField,
  TextareaAutosize,
} from "@material-ui/core";

const cmsList = [
  {
    name: "GOOGLE",
    link: "https://www.google.com/",
  },
  {
    name: "FACEBOOK",
    link: "https://www.facebook.com/",
  },
];

export default function CmsHelper() {
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

  const handleCmsChange = (event) => {
    setCmsName(event.target.value.name);
    setCmsLink(event.target.value.link);
  };

  return (
    <div>
      <div>
        <Select value={cmsName} onChange={handleCmsChange}>
          {cmsList.map((cms) => (
            <MenuItem value={cms}>{cms.name}</MenuItem>
          ))}
        </Select>
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
}
