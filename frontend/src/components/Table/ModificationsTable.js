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

const cols = [
  {
    name: "ID",
    type: "String",
    inputType: "TextField",
    disabled: true,
  },
  {
    name: "Test String",
    type: "String",
    inputType: "TextField",
    disabled: false,
  },
  {
    name: "Test String",
    type: "String",
    inputType: "TextField",
    disabled: true,
  },
  {
    name: "Test Number",
    type: "Number",
    inputType: "TextField",
    disabled: false,
  },
  {
    name: "Status",
    type: "String",
  },
  {
    name: "",
    type: "Button",
    inputType: "Button",
  },
];

class ModificationsTable extends React.Component {
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

  createInputComponent = (col) => {
    if (col.inputType === "TextField") {
      return (
        <TextField
          id="outlined-basic"
          label={col.name}
          variant="outlined"
          disabled={col.disabled ? true : false}
          size="small"
          fullWidth
          inputProps={{ sx: { fontSize: "0.875rem" } }}
          InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
          sx={{ backgroundColor: "#ffffff" }}
        />
      );
    } else if (col.inputType === "Button") {
      return (
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
                id: response.id,
                firstName: "Operation Successful",
              });
              this.setState({
                rows: newRows,
              });
            }
          }}
        >
          <AddCircleIcon />
        </IconButton>
      );
    }
  };

  render() {
    return (
      <Grid item xs={12}>
        <Paper elevation={1} className="paperPadding">
          <h2 className="paperTitle">Modifications</h2>
          <TableContainer component={Paper} className="paperTable">
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ height: "50px" }}>
                  {cols.map((col) => {
                    return (
                      <TableCell
                        align={col.type === "Number" ? "right" : "left"}
                      >
                        {col.name}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow sx={{ height: "50px" }}>
                  {cols.map((col) => {
                    return (
                      <TableCell className="paperTableModificationCell">
                        {this.createInputComponent(col)}
                      </TableCell>
                    );
                  })}
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

export default ModificationsTable;
