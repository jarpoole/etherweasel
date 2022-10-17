import React from "react";

import TabWithChildren from "./TabWithChildren";
import UnstyledLink from "../UnstyledLink";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

class AnalyticsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  createChildListItem = (childName, childIndex) => {
    return (
      <UnstyledLink to={`/Analytics/${childName.replace(/\s+/g, "")}`}>
        <ListItemButton key={childIndex} sx={{ pl: 4 }}>
          <ListItemIcon>
            <SubdirectoryArrowRightIcon />
          </ListItemIcon>
          <ListItemText primary={childName} />
        </ListItemButton>
      </UnstyledLink>
    );
  };

  render() {
    return (
      <TabWithChildren name={this.props.name} icon={<QueryStatsIcon />}>
        <List component="div" disablePadding>
          {this.props.devices.map((deviceName, deviceIndex) =>
            this.createChildListItem(deviceName, deviceIndex)
          )}
        </List>
      </TabWithChildren>
    );
  }
}

export default AnalyticsTab;
