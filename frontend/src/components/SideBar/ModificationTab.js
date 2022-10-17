import React from "react";

import TabWithChildren from "./TabWithChildren";
import UnstyledLink from "../UnstyledLink";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import BuildIcon from "@mui/icons-material/Build";

class ModificationTab extends React.Component {
  constructor(props) {
    super(props);
  }

  createChildListItem = (child) => {
    var childListItem = (
      <ListItemButton
        key={child.id}
        disabled={!child.isImplemented}
        sx={{ pl: 4 }}
      >
        <ListItemIcon>
          <SubdirectoryArrowRightIcon />
        </ListItemIcon>
        <ListItemText primary={child.name} />
      </ListItemButton>
    );
    return child.isImplemented ? (
      <UnstyledLink to={`/Modification/${child.name}`}>
        {childListItem}
      </UnstyledLink>
    ) : (
      childListItem
    );
  };

  render() {
    return (
      <TabWithChildren name={this.props.name} icon={<BuildIcon />}>
        <List component="div" disablePadding>
          {this.props.protocols.map((protocol) =>
            this.createChildListItem(protocol)
          )}
        </List>
      </TabWithChildren>
    );
  }
}

export default ModificationTab;
