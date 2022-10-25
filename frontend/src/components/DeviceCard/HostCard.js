import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import Chip from "@mui/material/Chip";
import LanguageIcon from "@mui/icons-material/Language";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";

import DeviceCard from "./DeviceCard";

class HostCard extends React.Component {
  generateStatusChip = (isConnected) => {
    return isConnected ? (
      <Chip icon={<LanguageIcon />} color="success" label="Connected" />
    ) : (
      <Chip icon={<HighlightOffIcon />} color="error" label="Not Connected" />
    );
  };

  render() {
    return (
      <DeviceCard
        title={this.props.title}
        icon={<DesktopWindowsOutlinedIcon style={{ fontSize: "6rem" }} />}
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
                {this.generateStatusChip(this.props.isConnected)}
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                {"IP"}
              </TableCell>
              <TableCell align="right">{this.props.ip}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DeviceCard>
    );
  }
}
export default HostCard;
