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
import Chip from "@mui/material/Chip";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";

import EtherWeaselService from "../../services/EtherWeaselService";
import TableHeader from "../Tooltip/TableHeader";

const cols = [
  {
    name: "FQDN",
    width: "40%",
    tooltipLabel: "Fully Qualified Domain Name",
  },
  {
    name: "IPV4",
    width: "40%",
    tooltipLabel: "Internet Protocol version 4",
  },
  {
    name: "TTL",
    width: "40%",
    tooltipLabel: "Time to Live",
  },
  {
    name: "Status",
    width: 100,
  },
  {
    name: "",
    width: 40,
  },
];
class ModificationsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      deletedRows: [],
      fqdnInput: "",
      ipv4Input: "",
      ttlInput: "",
      fqdnError: false,
      ipv4Error: false,
      ttlError: false,
    };
  }

  createInputRow = () => {
    return (
      <TableRow sx={{ height: "50px" }}>
        <TableCell className="paperTableModificationInputCell">
          {this.createInputTextField(
            cols[0].name,
            this.state.fqdnError,
            (event) =>
              this.setState({ fqdnInput: event.target.value, fqdnError: false })
          )}
        </TableCell>
        <TableCell className="paperTableModificationInputCell">
          {this.createInputTextField(
            cols[1].name,
            this.state.ipv4Error,
            (event) =>
              this.setState({ ipv4Input: event.target.value, ipv4Error: false })
          )}
        </TableCell>
        <TableCell className="paperTableModificationInputCell">
          {this.createInputTextField(
            cols[2].name,
            this.state.ttlError,
            (event) =>
              this.setState({ ttlInput: event.target.value, ttlError: false })
          )}
        </TableCell>
        <TableCell className="paperTableModificationInputCell" />
        <TableCell className="paperTableModificationInputCell" align="center">
          <IconButton onClick={() => this.handleCreateAttack()}>
            <AddCircleIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  createInputTextField = (name, error, handleChange) => (
    <TextField
      id="outlined-basic"
      label={name}
      variant="outlined"
      error={error ? true : false}
      size="small"
      fullWidth
      inputProps={{ sx: { fontSize: "0.875rem" } }}
      InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
      sx={{ backgroundColor: "#ffffff" }}
      onChange={handleChange}
    />
  );

  createOutputRow = (row, index, type) => (
    <TableRow key={index}>
      <TableCell component="th" scope="row" className={type}>
        {row.fqdn}
      </TableCell>
      <TableCell>{row.ipv4}</TableCell>
      <TableCell align="right">{row.ttl}</TableCell>
      <TableCell align="center">
        {type === "row" && (
          <Chip color="success" label="In Progress" sx={{ width: "100%" }} />
        )}
        {type === "rowInfo" && (
          <Chip color="info" label="Queued" sx={{ width: "100%" }} />
        )}
        {type === "rowError" && (
          <Chip color="error" label="Stopped" sx={{ width: "100%" }} />
        )}
      </TableCell>
      <TableCell align="center">
        {type === "row" || type === "rowInfo" ? (
          <IconButton onClick={() => this.handleDeleteAttack(row)}>
            <DeleteIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => this.handleRestartAttack(row)}>
            <ReplayCircleFilledIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );

  handleCreateAttack = async () => {
    let valid = true;

    // From https://stackoverflow.com/questions/4460586/javascript-regular-expression-to-check-for-ip-addresses
    if (
      !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        this.state.ipv4Input
      )
    ) {
      valid = false;
      this.state.ipv4Error = true;
    }

    let ttlInputNumber = Math.floor(Number(this.state.ttlInput));
    if (String(ttlInputNumber) !== this.state.ttlInput || ttlInputNumber <= 0) {
      valid = false;
      this.state.ttlError = true;
    }

    if (!valid) {
      this.setState({
        ipv4Error: this.state.ipv4Error,
        ttlError: this.state.ttlError,
      });

      return;
    }

    let response = await EtherWeaselService.postAttack(
      JSON.stringify({
        type: "dns",
        config: {
          fqdn: this.state.fqdnInput,
          ipv4: this.state.ipv4Input,
          ttl: Number(this.state.ttlInput),
          logging: true,
        },
      })
    );

    if (response) {
      this.setState({
        rows: await EtherWeaselService.getAttacks("dns"),
        ipv4Error: this.state.false,
        ttlError: this.state.false,
      });
    }
  };

  handleDeleteAttack = async (attack) => {
    let response = await EtherWeaselService.deleteAttack(attack.uuid);
    if (response) {
      let newDeletedRows = this.state.deletedRows;
      newDeletedRows.push(attack);

      this.setState({
        rows: await EtherWeaselService.getAttacks("dns"),
        deletedRows: newDeletedRows,
      });
    }
  };

  handleRestartAttack = async (attack) => {
    let response = await EtherWeaselService.postAttack(
      JSON.stringify({
        type: "dns",
        config: {
          fqdn: attack.fqdn,
          ipv4: attack.ipv4,
          ttl: Number(attack.ttl),
          logging: true,
        },
      })
    );

    if (response) {
      let newDeletedRows = this.state.deletedRows.filter(
        (row) => row.uuid !== attack.uuid
      );

      this.setState({
        rows: await EtherWeaselService.getAttacks("dns"),
        deletedRows: newDeletedRows,
      });
    }
  };

  async componentDidMount() {
    this.setState({
      rows: await EtherWeaselService.getAttacks("dns"),
    });
  }

  render() {
    return (
      <Grid item xs={12}>
        <Paper elevation={1} className="paperPadding">
          <h2 className="paperTitle">Modifications</h2>
          <TableContainer component={Paper} className="paperTable">
            <Table
              stickyHeader
              sx={{
                ".row": {
                  borderLeftColor: (theme) => theme.palette.success.light,
                  borderLeftStyle: "solid",
                  borderLeftWidth: "5px",
                },
                ".rowWarning": {
                  borderLeftColor: (theme) => theme.palette.warning.light,
                  borderLeftStyle: "solid",
                  borderLeftWidth: "5px",
                },
                ".rowError": {
                  borderLeftColor: (theme) => theme.palette.error.light,
                  borderLeftStyle: "solid",
                  borderLeftWidth: "5px",
                },
                ".rowInfo": {
                  borderLeftColor: (theme) => theme.palette.info.light,
                  borderLeftStyle: "solid",
                  borderLeftWidth: "5px",
                },
              }}
              size="small"
            >
              <TableHead>
                <TableRow sx={{ height: "50px" }}>
                  {cols.map((col, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        width: col.width,
                        minWidth: col.width,
                        maxWidth: col.width,
                      }}
                    >
                      <TableHeader
                        tooltipLabel={col.tooltipLabel}
                        header={col.name}
                      />
                    </TableCell>
                  ))}
                </TableRow>
                {this.createInputRow()}
              </TableHead>
              <TableBody>
                {this.state.rows.map((row, index) =>
                  this.props.deviceMode ===
                  EtherWeaselService.deviceModes.ACTIVE
                    ? this.createOutputRow(row, index, "row")
                    : this.createOutputRow(row, index, "rowInfo")
                )}
                {this.state.deletedRows.map((row, index) =>
                  this.createOutputRow(row, index, "rowError")
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    );
  }
}

export default ModificationsTable;
