import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

function UnstyledLink(props) {
  return (
    <Link
      style={{
        color: "inherit",
        textDecoration: "inherit",
        display: props.display,
      }}
      component={RouterLink}
      to={`${props.to}`}
    >
      {props.children}
    </Link>
  );
}

export default UnstyledLink;
