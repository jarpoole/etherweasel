import React from "react";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import MatBreadcrumbs from "@mui/material/Breadcrumbs";
import { Link as RouterLink, useLocation } from "react-router-dom";

const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

function Breadcrumbs(props) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Paper elevation={1} sx={{ flexGrow: 1, p: 1 }}>
      <MatBreadcrumbs aria-label="breadcrumb">
        <LinkRouter
          underline="hover"
          color={pathnames?.length ? "inherit" : "text.primary"}
          to="/"
        >
          Home
        </LinkRouter>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          var color = last ? "text.primary" : "inherit";
          return last || props.unreachablePages.includes(to) ? (
            <Typography color={color} key={to}>
              {props.routePathNames[to]}
            </Typography>
          ) : (
            <LinkRouter underline="hover" color={color} to={to} key={to}>
              {props.routePathNames[to]}
            </LinkRouter>
          );
        })}
      </MatBreadcrumbs>
    </Paper>
  );
}

export default Breadcrumbs;
