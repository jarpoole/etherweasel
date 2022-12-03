import React from "react";

import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Checkbox from "@mui/material/Checkbox";

import Subtable from "./Subtable";
import TableChip from "../Tooltip/TableChip";

const DNSQuestionsHeader = [
  {
    name: "Name",
  },
  {
    name: "Type",
  },
  {
    name: "Class",
  },
];

const DNSAnswersHeader = [
  {
    name: "Type",
  },
  {
    name: "FQDN",
    tooltipLabel: "Fully Qualified Domain Name",
  },
  {
    name: "IPv4",
    tooltipLabel: "Internet Protocol version 4",
  },
  {
    name: "TTL",
    tooltipLabel: "Time to Live",
  },
];

class CollapsibleRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  flagComponent = (flag) => {
    return flag ? (
      <Checkbox disabled checked size="small" />
    ) : (
      <Checkbox disabled size="small" />
    );
  };

  render() {
    return (
      <React.Fragment>
        <TableRow
          key={"main" + this.props.index}
          sx={{
            "& .MuiTableCell-root": { borderBottom: "unset" },
            height: "60px",
          }}
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
          <TableCell className="paperTableLogsComponentCell">
            {this.flagComponent(this.props.row.dns_qr)}
          </TableCell>
          <TableCell className="paperTableLogsComponentCell">
            {this.flagComponent(this.props.row.dns_aa)}
          </TableCell>
          <TableCell className="paperTableLogsComponentCell">
            {this.flagComponent(this.props.row.dns_rd)}
          </TableCell>
          <TableCell className="paperTableLogsComponentCell">
            {this.flagComponent(this.props.row.dns_ra)}
          </TableCell>
        </TableRow>
        <TableRow key={"subtables" + this.props.index}>
          <TableCell
            sx={{
              paddingBottom: 0,
              paddingTop: 0,
            }}
          />
          <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Subtable
              open={this.state.open}
              title="DNS Questions"
              headers={DNSQuestionsHeader}
            >
              <TableBody>
                {this.props.row.dns_questions.map((dnsQuestionsRow, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {dnsQuestionsRow.name}
                    </TableCell>
                    <TableCell>{dnsQuestionsRow.type}</TableCell>
                    <TableCell>{dnsQuestionsRow.class}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Subtable>
          </TableCell>
          <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Subtable
              open={this.state.open}
              title="DNS Answers"
              headers={DNSAnswersHeader}
            >
              <TableBody>
                {this.props.row.dns_answers.map((dnsAnswerRow, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {dnsAnswerRow.type}
                    </TableCell>
                    <TableCell>{dnsAnswerRow.fqdn}</TableCell>
                    <TableCell>
                      {dnsAnswerRow.ipv4[0] === dnsAnswerRow.ipv4[1] ? (
                        dnsAnswerRow.ipv4[1]
                      ) : (
                        <TableChip
                          chipLabel={dnsAnswerRow.ipv4[1]}
                          tooltipLabel={`Modified from IPv4: ${dnsAnswerRow.ipv4[0]}`}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {dnsAnswerRow.ttl[0] === dnsAnswerRow.ttl[1] ? (
                        dnsAnswerRow.ttl[1]
                      ) : (
                        <TableChip
                          chipLabel={dnsAnswerRow.ttl[1]}
                          tooltipLabel={`Modified from TTL: ${dnsAnswerRow.ttl[0]}`}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Subtable>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
}

export default CollapsibleRow;
