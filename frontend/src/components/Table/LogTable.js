import React from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Mock Data
const rows = [
  {
    id: 1,
    lastName: "Snow",
    firstName: "Jon",
    age: 35,
    status: "Success",
  },
  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    age: 42,
    status: "Info",
  },
  {
    id: 3,
    lastName: "Lannister",
    firstName: "Jaime",
    age: 45,
    status: "Info",
  },
  {
    id: 4,
    lastName: "Starker",
    firstName: "Aryana",
    age: 16,
    status: "Warning",
  },
  {
    id: 5,
    lastName: "Targaryen",
    firstName: "Daenerys",
    age: null,
    status: "Error",
  },
  {
    id: 6,
    lastName: "Melisandre",
    firstName: "Melisandre",
    age: 150,
    status: "Warning",
  },
  {
    id: 7,
    lastName: "Clifford",
    firstName: "Ferrara",
    age: 44,
    status: "Error",
  },
  {
    id: 8,
    lastName: "Frances",
    firstName: "Rossini",
    age: 36,
    status: "Warning",
  },
  {
    id: 9,
    lastName: "Roxien",
    firstName: "Harvester",
    age: 65,
    status: "Error",
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
              height: 300,
              width: "100%",
              boxShadow: "none",
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "rgba(224, 224, 224, 1)",
            }}
          >
            <Table
              stickyHeader
              sx={{
                ".logHeader": {
                  paddingLeft: "20px",
                },
                ".logRowSuccess": {
                  borderLeftColor: (theme) => theme.palette.success.light,
                  borderLeftStyle: "solid",
                  borderLeftWidth: "5px",
                },
                ".logRowWarning": {
                  borderLeftColor: (theme) => theme.palette.warning.light,
                  borderLeftStyle: "solid",
                  borderLeftWidth: "5px",
                },
                ".logRowError": {
                  borderLeftColor: (theme) => theme.palette.error.light,
                  borderLeftStyle: "solid",
                  borderLeftWidth: "5px",
                },
                ".logRowInfo": {
                  borderLeftColor: (theme) => theme.palette.info.light,
                  borderLeftStyle: "solid",
                  borderLeftWidth: "5px",
                },
              }}
              size="small"
            >
              <TableHead sx={{ height: "50px" }}>
                <TableRow>
                  <TableCell className="logHeader">ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell align="right">Age</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell
                      component="th"
                      scope="row"
                      className={`logRow${row.status}`}
                    >
                      {row.id}
                    </TableCell>
                    <TableCell>{row.firstName}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell align="right">{row.age}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
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
