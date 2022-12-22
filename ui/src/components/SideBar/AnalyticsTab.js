import React from "react";

import UnstyledLink from "../UnstyledLink";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

class AnalyticsTab extends React.Component {
  render() {
    return (
      <UnstyledLink to={`/Analytics`}>
        <ListItemButton>
          <ListItemIcon>
            <QueryStatsIcon />
          </ListItemIcon>
          <ListItemText primary={this.props.name} />
        </ListItemButton>
      </UnstyledLink>
    );
  }
}

export default AnalyticsTab;
