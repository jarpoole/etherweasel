import React from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import CollapsibleRow from "./CollapsibleRow";

const cols = [
  {
    name: "",
    width: "40%",
  },
  {
    name: "Src",
    width: "40%",
  },
  {
    name: "Dest",
    width: "35%",
  },
  {
    name: "Src",
    width: 80,
  },
  {
    name: "Dest",
    width: 100,
  },
  {
    name: "Src",
    width: 40,
  },
  {
    name: "Dest",
    width: 40,
  },
  {
    name: "QR",
    width: 40,
  },
  {
    name: "AA",
    width: 40,
  },
  {
    name: "RD",
    width: 40,
  },
  {
    name: "RA",
    width: 40,
  },
];
// Mock Data
const rows = [
  {
    eth_src_addr: "aa:bb:cc:dd:ee:02",
    eth_dest_addr: "aa:bb:cc:dd:ee:01",
    ipv4_src_addr: "192.168.0.2",
    ipv4_dest_addr: "192.168.0.1",
    udp_src_port: 53,
    udp_dest_port: 38827,
    dns_qr: true,
    dns_aa: true,
    dns_rd: true,
    dns_ra: false,
    dns_questions: [
      {
        name: "sub1.example.local.",
        type: "A",
        class: "IN",
      },
    ],
    dns_answers: [
      {
        type: "A",
        fqdn: "sub1.example.local.",
        ttl: [30, 3000],
        ipv4: ["192.168.0.1", "192.168.0.4"],
      },
    ],
  },
  {
    eth_src_addr: "aa:bb:cc:dd:ee:02",
    eth_dest_addr: "aa:bb:cc:dd:ee:01",
    ipv4_src_addr: "192.168.0.2",
    ipv4_dest_addr: "192.168.0.1",
    udp_src_port: 53,
    udp_dest_port: 54806,
    dns_qr: true,
    dns_aa: true,
    dns_rd: true,
    dns_ra: false,
    dns_questions: [
      {
        name: "sub1.example.local.",
        type: "A",
        class: "IN",
      },
    ],
    dns_answers: [
      {
        type: "A",
        fqdn: "sub1.example.local.",
        ttl: [30, 3000],
        ipv4: ["192.168.0.1", "192.168.0.4"],
      },
    ],
  },
  {
    eth_src_addr: "aa:bb:cc:dd:ee:02",
    eth_dest_addr: "aa:bb:cc:dd:ee:01",
    ipv4_src_addr: "192.168.0.2",
    ipv4_dest_addr: "192.168.0.1",
    udp_src_port: 53,
    udp_dest_port: 60616,
    dns_qr: true,
    dns_aa: true,
    dns_rd: true,
    dns_ra: false,
    dns_questions: [
      {
        name: "sub1.example.local.",
        type: "A",
        class: "IN",
      },
    ],
    dns_answers: [
      {
        type: "A",
        fqdn: "sub1.example.local.",
        ttl: [30, 3000],
        ipv4: ["192.168.0.1", "192.168.0.4"],
      },
    ],
  },
  {
    eth_src_addr: "aa:bb:cc:dd:ee:02",
    eth_dest_addr: "aa:bb:cc:dd:ee:01",
    ipv4_src_addr: "192.168.0.2",
    ipv4_dest_addr: "192.168.0.1",
    udp_src_port: 53,
    udp_dest_port: 33264,
    dns_qr: true,
    dns_aa: true,
    dns_rd: true,
    dns_ra: false,
    dns_questions: [
      {
        name: "sub1.example.local.",
        type: "A",
        class: "IN",
      },
    ],
    dns_answers: [
      {
        type: "A",
        fqdn: "sub1.example.local.",
        ttl: [30, 3000],
        ipv4: ["192.168.0.1", "192.168.0.4"],
      },
    ],
  },
  {
    eth_src_addr: "aa:bb:cc:dd:ee:02",
    eth_dest_addr: "aa:bb:cc:dd:ee:01",
    ipv4_src_addr: "192.168.0.2",
    ipv4_dest_addr: "192.168.0.1",
    udp_src_port: 53,
    udp_dest_port: 44196,
    dns_qr: true,
    dns_aa: true,
    dns_rd: true,
    dns_ra: false,
    dns_questions: [
      {
        name: "sub1.example.local.",
        type: "A",
        class: "IN",
      },
    ],
    dns_answers: [
      {
        type: "A",
        fqdn: "sub1.example.local.",
        ttl: [30, 3000],
        ipv4: ["192.168.0.1", "192.168.0.4"],
      },
    ],
  },
];

class LogTable extends React.Component {
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
                  <TableCell />
                  <TableCell colSpan={2} align="center">
                    Ethernet Address
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    IPV4 Address
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    UDP Port
                  </TableCell>
                  <TableCell colSpan={4} align="center">
                    Flags
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableHead sx={{ height: "50px" }}>
                <TableRow>
                  {cols.map((col, index) => (
                    <TableCell key={index} className="paperTableLogsHeaderCell">
                      {col.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <CollapsibleRow row={row} key={index} />
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
