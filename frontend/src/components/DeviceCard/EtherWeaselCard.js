import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import Chip from "@mui/material/Chip";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";

import DeviceCard from "./DeviceCard";

const theme = createTheme({
  palette: {
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

class EtherWeaselCard extends React.Component {
  generateModeChip = (isActiveMode) => {
    return isActiveMode ? (
      <Chip icon={<ToggleOnOutlinedIcon />} color="success" label="Active" />
    ) : (
      <Chip icon={<ToggleOffOutlinedIcon />} color="neutral" label="Passive" />
    );
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <DeviceCard
          title={this.props.title}
          icon={<DeveloperBoardIcon style={{ fontSize: "6rem" }} />}
        >
          <Table
            style={{ padding: "4px 26px 0px 26px" }}
            aria-label="simple table"
          >
            <TableBody>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {"Status"}
                </TableCell>
                <TableCell align="right">
                  {this.generateModeChip(this.props.isActiveMode)}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {"DNS Modifications"}
                </TableCell>
                <TableCell align="right">
                  {this.props.successfulModifications}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DeviceCard>
      </ThemeProvider>
    );
  }
}
export default EtherWeaselCard;
