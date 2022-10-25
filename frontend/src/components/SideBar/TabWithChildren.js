import React from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

class TabWithChildren extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  handleClick = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  render() {
    return (
      <React.Fragment>
        <ListItemButton onClick={this.handleClick}>
          <ListItemIcon>{this.props.icon}</ListItemIcon>
          <ListItemText primary={this.props.name} />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {this.props.children}
          </List>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default TabWithChildren;
