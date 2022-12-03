import React from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import EtherWeaselService from "../../services/EtherWeaselService";
import CollapsibleRow from "./CollapsibleRow";
import TableHeader from "../Tooltip/TableHeader";

const interval = 1000;
const cols = [
  {
    name: "",
    width: "50",
  },
  {
    name: "Src",
    width: "17%",
  },
  {
    name: "Dest",
    width: "17%",
  },
  {
    name: "Src",
    width: "13%",
  },
  {
    name: "Dest",
    width: "13%",
  },
  {
    name: "Src",
    width: "55",
  },
  {
    name: "Dest",
    width: "55",
  },
  {
    name: "QR",
    tooltipLabel: "Query",
  },
  {
    name: "AA",
    tooltipLabel: "Authoritative Answer",
    width: "55",
  },
  {
    name: "RD",
    tooltipLabel: "Recursion Desired",
    width: "55",
  },
  {
    name: "RA",
    tooltipLabel: "Recursion Available",
    width: "55",
  },
];

class LogTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
    };
  }

  componentDidMount() {
    // Run it once to render everything properly
    this.loadLogs();

    // Run the calls in an interval
    this.loadLogsIntervalID = setInterval(this.loadLogs, interval);
  }

  componentWillUnmount() {
    clearInterval(this.loadLogsIntervalID);
  }

  loadLogs = async () => {
    let newLogs = await EtherWeaselService.getLogs("dns");

    if (newLogs) {
      this.setState({
        logs: newLogs,
      });
    }
  };

  render() {
    return (
      <Grid item xs={12}>
        <Paper elevation={1} className="paperPadding">
          <h2 className="paperTitle">Logs</h2>
          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
            }}
            className="paperTable"
          >
            <Table stickyHeader size="small">
              <TableHead sx={{ height: "50px" }}>
                <TableRow>
                  <TableCell
                    className="paperTableLogsComponentCell"
                    align="center"
                  >
                    <IconButton size="small" disabled>
                      <KeyboardArrowDownIcon sx={{ opacity: 0 }} />
                    </IconButton>
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    <TableHeader header="Ethernet Address" />
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    <TableHeader header="IPV4 Address" />
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    <TableHeader header="UDP Port" />
                  </TableCell>
                  <TableCell colSpan={4} align="center">
                    <TableHeader header="Flags" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableHead sx={{ height: "50px" }}>
                <TableRow>
                  {cols.map((col, index) => (
                    <TableCell
                      key={index}
                      className="paperTableLogsHeaderCell"
                      sx={{
                        width: col.width,
                        minWidth: col.width,
                        maxWidth: col.width,
                      }}
                    >
                      <TableHeader
                        header={col.name}
                        tooltipLabel={col.tooltipLabel}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(this.state.logs) &&
                  this.state.logs.length !== 0 &&
                  this.state.logs.map((log, index) => (
                    <CollapsibleRow row={log} key={index} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    );
  }
}

export default LogTable;
