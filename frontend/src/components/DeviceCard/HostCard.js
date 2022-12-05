import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";

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

class HostCard extends React.Component {
  generateStatusChip = (hostStatus) => {
    if (hostStatus === EtherWeaselService.hostStatuses.UNKNOWN) {
      return (
        <Chip
          data-test-id="HostStatusChip"
          icon={<HelpOutlineOutlinedIcon />}
          color="neutral"
          label="Unknown"
        />
      );
    } else if (hostStatus === EtherWeaselService.hostStatuses.DISCONNECTED) {
      return (
        <Chip
          data-test-id="HostStatusChip"
          icon={<HighlightOffIcon />}
          color="error"
          label="Disconnected"
        />
      );
    } else if (hostStatus === EtherWeaselService.hostStatuses.CONNECTED) {
      return (
        <Chip
          data-test-id="HostStatusChip"
          icon={<LanguageIcon />}
          color="success"
          label="Connected"
        />
      );
    } else {
      return (
        <Chip
          data-test-id="HostStatusChip"
          icon={<HighlightOffIcon />}
          color="error"
          label="Error"
        />
      );
    }
  };

  generateTableCell = (body, loading) => {
    return loading ? (
      <TableCell align="right">
        <Skeleton variant="rectangular" width="100%" />
      </TableCell>
    ) : (
      <TableCell align="right">{body}</TableCell>
    );
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <DeviceCard
          title={this.props.title}
          icon={<DesktopWindowsOutlinedIcon style={{ fontSize: "6rem" }} />}
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
                {this.generateTableCell(
                  this.generateStatusChip(this.props.hostStatus),
                  this.props.loading
                )}
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
                  {"Interface Name"}
                </TableCell>

                {this.generateTableCell(
                  this.props.interfaceName,
                  this.props.loading
                )}
              </TableRow>
            </TableBody>
          </Table>
        </DeviceCard>
      </ThemeProvider>
    );
  }
}
export default HostCard;
