import React from "react";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import SideBar from "./components/SideBar/SideBar";
import NavBar from "./components/AppBar";
import Breadcrumbs from "./components/Breadcrumbs";

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

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1200,
      lg: 2000,
      xl: 2536,
    },
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActiveMode: true,
    };
  }

  updateIsActiveMode = () => {
    this.setState({
      isActiveMode: !this.state.isActiveMode,
    });
  };

  render() {
    var childrenWithProps = React.Children.map(
      this.props.children,
      (Child, i) => {
        return React.cloneElement(Child, {
          isActiveMode: this.state.isActiveMode,
          updateIsActiveMode: this.updateIsActiveMode,
        });
      }
    );

    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <NavBar />
          <SideBar protocols={protocols} />
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <div style={{ position: "relative" }}>
              <div
                style={{ position: "absolute", width: "100%", height: "100%" }}
              >
                <Breadcrumbs
                  routePathNames={this.props.routePathNames}
                  unreachablePages={this.props.unreachablePages}
                />
                {childrenWithProps}
              </div>
            </div>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
}
export default App;
