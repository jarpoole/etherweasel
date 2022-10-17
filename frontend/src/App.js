import React from "react";

import SideBar from "./components/SideBar/SideBar";
import NavBar from "./components/AppBar";
import Breadcrumbs from "./components/Breadcrumbs";
import Box from "@mui/material/Box";
import { Paper } from "@mui/material";

// Mock Data
const protocols = [
  {
    id: 1,
    name: "DNS",
    isImplemented: true,
  },
  {
    id: 2,
    name: "HTTP",
    isImplemented: false,
  },
  {
    id: 3,
    name: "VoIP",
    isImplemented: false,
  },
];

const analytics = ["Host", "MitM Attack Device", "Network Gateway"];

function App(props) {
  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <SideBar protocols={protocols} analytics={analytics} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Paper elevation={1} sx={{ flexGrow: 1, p: 1 }}>
          <Breadcrumbs />
        </Paper>
        {props.children}
      </Box>
    </Box>
  );
}

export default App;
