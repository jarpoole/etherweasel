import React from "react";

import ModificationTab from "./ModificationTab";
import AnalyticsTab from "./AnalyticsTab";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";

class SideBar extends React.Component {
  render() {
    const drawerWidth = 240;

    return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ModificationTab
              name="Modification"
              protocols={this.props.protocols}
            ></ModificationTab>

            <AnalyticsTab name="Analytics"></AnalyticsTab>
          </List>
        </Box>
      </Drawer>
    );
  }
}

export default SideBar;
