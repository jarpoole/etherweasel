import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

class UnstyledLink extends React.Component {
  render() {
    return (
      <Link
        style={{
          color: "inherit",
          textDecoration: "inherit",
          display: this.props.display,
        }}
        component={RouterLink}
        to={`${this.props.to}`}
      >
        {this.props.children}
      </Link>
    );
  }
}
export default UnstyledLink;
