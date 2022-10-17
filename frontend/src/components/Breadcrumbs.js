import React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import MatBreadcrumbs from "@mui/material/Breadcrumbs";
import { Link as RouterLink, useLocation } from "react-router-dom";

const breadcrumbNameMap = {
  "/": "Home",
  "/Modification": "Modification",
  "/Modification/DNS": "DNS",
  "/Analytics": "Analytics",
  "/Analytics/Host": "Host",
  "/Analytics/MitMAttackDevice": "MitM Attack Device",
  "/Analytics/NetworkGateway": "Network Gateway",
};

const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  console.log(pathnames);
  return (
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
        return last || to == "/Modification" || to == "/Analytics" ? (
          <Typography color={color} key={to}>
            {breadcrumbNameMap[to]}
          </Typography>
        ) : (
          <LinkRouter underline="hover" color={color} to={to} key={to}>
            {breadcrumbNameMap[to]}
          </LinkRouter>
        );
      })}
    </MatBreadcrumbs>
  );
}

export default Breadcrumbs;
