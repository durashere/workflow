import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const Footer = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Made by © "}
      <Link color="inherit" href="/">
        Duras
      </Link>{" "}
      {"2020-" + new Date().getFullYear()}.
    </Typography>
  );
};

export default Footer;
