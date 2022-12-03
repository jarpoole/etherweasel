import React from "react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import TableHeader from "../Tooltip/TableHeader";

class Subtable extends React.Component {
  render() {
    return (
      <Collapse in={this.props.open} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1 }}>
          <h2 className="paperSubtitle">{this.props.title}</h2>
          <Table size="small">
            <TableHead>
              <TableRow>
                {this.props.headers.map((col, index) => (
                  <TableCell key={index}>
                    <TableHeader
                      header={col.name}
                      tooltipLabel={col.tooltipLabel}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {this.props.children}
          </Table>
        </Box>
      </Collapse>
    );
  }
}
export default Subtable;
