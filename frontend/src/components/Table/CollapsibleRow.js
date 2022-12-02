import React from "react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Checkbox from "@mui/material/Checkbox";

class CollapsibleRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  flagComponent(flag) {
    return flag ? (
      <Checkbox disabled checked size="small" />
    ) : (
      <Checkbox disabled size="small" />
    );
  }

  render() {
    return (
      <React.Fragment>
        <TableRow
          key={"main" + this.props.index}
          sx={{ "& .MuiTableCell-root": { borderBottom: "unset" } }}
        >
          <TableCell className="paperTableLogsComponentCell" align="center">
            <IconButton
              size="small"
              onClick={() => this.setState({ open: !this.state.open })}
            >
              {this.state.open ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {this.props.row.eth_src_addr}
          </TableCell>
          <TableCell>{this.props.row.eth_dest_addr}</TableCell>
          <TableCell>{this.props.row.ipv4_src_addr}</TableCell>
          <TableCell>{this.props.row.ipv4_dest_addr}</TableCell>
          <TableCell>{this.props.row.udp_src_port}</TableCell>
          <TableCell>{this.props.row.udp_dest_port}</TableCell>
          <TableCell className="paperTableLogsComponentCell" align="center">
            {this.flagComponent(this.props.row.dns_qr)}
          </TableCell>
          <TableCell className="paperTableLogsComponentCell" align="center">
            {this.flagComponent(this.props.row.dns_aa)}
          </TableCell>
          <TableCell className="paperTableLogsComponentCell" align="center">
            {this.flagComponent(this.props.row.dns_rd)}
          </TableCell>
          <TableCell className="paperTableLogsComponentCell" align="center">
            {this.flagComponent(this.props.row.dns_ra)}
          </TableCell>
        </TableRow>
        <TableRow key={"questions" + this.props.index}>
          <TableCell
            colSpan={11}
            sx={{
              borderBottom: "unset",
              paddingBottom: 0,
              paddingTop: 0,
            }}
          >
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <h2 className="paperSubtitle">DNS Questions</h2>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Class</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.props.row.dns_questions.map(
                      (dnsQuestionsRow, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            {dnsQuestionsRow.name}
                          </TableCell>
                          <TableCell>{dnsQuestionsRow.type}</TableCell>
                          <TableCell align="right">
                            {dnsQuestionsRow.class}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow key={"answers" + this.props.index}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <h2 className="paperSubtitle">DNS Answers</h2>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>FQDN</TableCell>
                      <TableCell>TTL</TableCell>
                      <TableCell>IPv4</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.props.row.dns_answers.map((dnsAnswersRow, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {dnsAnswersRow.type}
                        </TableCell>
                        <TableCell>{dnsAnswersRow.fqdn}</TableCell>
                        <TableCell>{dnsAnswersRow.ttl[1]}</TableCell>
                        <TableCell>{dnsAnswersRow.ipv4[1]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
}

export default CollapsibleRow;
