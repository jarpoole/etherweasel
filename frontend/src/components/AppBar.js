import React from "react";

import Link from "./UnstyledLink";

import AppBar from "@mui/material/AppBar";
import PetsIcon from "@mui/icons-material/Pets";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

class NavBar extends React.Component {
  render() {
    return (
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar disableGutters>
          <Link to={`/`} display="flex">
            <PetsIcon
              sx={{
                display: { xs: "none", md: "flex" },
                margin: "auto",
                ml: 2,
              }}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                margin: "auto",
                ml: 1,
              }}
            >
              ETHER-WEASEL
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    );
  }
}

export default NavBar;
