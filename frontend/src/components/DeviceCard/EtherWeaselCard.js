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
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import DeviceCard from "./DeviceCard";
import EtherWeaselService from "../../services/EtherWeaselService";

const theme = createTheme({
  palette: {
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

class EtherWeaselCard extends React.Component {
  generateModeChip = (deviceMode) => {
    if (deviceMode === EtherWeaselService.deviceModes.DISCONNECTED) {
      return (
        <Chip
          data-test-id="EtherWeaselStatusChip"
          icon={<HighlightOffIcon />}
          color="error"
          label="Disconnected"
        />
      );
    } else if (deviceMode === EtherWeaselService.deviceModes.PASSIVE) {
      return (
        <Chip
          data-test-id="EtherWeaselStatusChip"
          icon={<ToggleOffOutlinedIcon />}
          color="neutral"
          label="Passive"
        />
      );
    } else if (deviceMode === EtherWeaselService.deviceModes.ACTIVE) {
      return (
        <Chip
          data-test-id="EtherWeaselStatusChip"
          icon={<ToggleOnOutlinedIcon />}
          color="success"
          label="Active"
        />
      );
    } else {
      return (
        <Chip
          data-test-id="EtherWeaselStatusChip"
          icon={<HighlightOffIcon />}
          color="error"
          label="Error"
        />
      );
    }
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
            size="small"
          >
            <TableBody>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell
                  className="deviceCardCell"
                  component="th"
                  scope="row"
                >
                  {"Status"}
                </TableCell>
                <TableCell align="right">
                  {this.generateModeChip(this.props.deviceMode)}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell
                  className="deviceCardCell"
                  component="th"
                  scope="row"
                >
                  {"Name"}
                </TableCell>
                <TableCell align="right">{this.props.name}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DeviceCard>
      </ThemeProvider>
    );
  }
}
export default EtherWeaselCard;
