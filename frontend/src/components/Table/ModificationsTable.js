import React from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import EtherWeaselService from "../../services/EtherWeaselService";

class DNS extends React.Component {
  constructor(props) {
    super(props);
    // Mock Data
    this.state = {
      rows: [
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
          status: "Success",
        },
        {
          id: 3,
          lastName: "Lannister",
          firstName: "Jaime",
          age: 45,
          status: "Success",
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
      ],
    };
  }

  render() {
    return (
      <Grid item xs={12}>
        <Paper elevation={1} className="paperPadding">
          <h2 className="paperTitle">Modifications</h2>
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
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ height: "50px" }}>
                  <TableCell className="logHeader">ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell align="right">Age</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    height: "70px",
                  }}
                >
                  <TableCell className="logHeader" style={{ top: 50 }}>
                    <TextField
                      id="outlined-basic"
                      label="ID"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell style={{ top: 50 }}>
                    <TextField
                      id="outlined-basic"
                      label="First Name"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell style={{ top: 50 }}>
                    <TextField
                      id="outlined-basic"
                      label="Last Name"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="right" style={{ top: 50 }}>
                    <TextField
                      id="outlined-basic"
                      label="Age"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell style={{ top: 50 }}></TableCell>
                  <TableCell style={{ top: 50 }}>
                    <IconButton
                      onClick={async () => {
                        let response = await EtherWeaselService.postAttack(
                          JSON.stringify({
                            type: "dns",
                            config: {},
                          })
                        );
                        if (response) {
                          let newRows = this.state.rows;
                          newRows.unshift({
                            id: "Operation Successful",
                          });
                          this.setState({
                            rows: newRows,
                          });
                        }
                      }}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.rows.map((row) => (
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
                    <TableCell>
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
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

export default DNS;
