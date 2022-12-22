import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

class TableChip extends React.Component {
  render() {
    return (
      <Tooltip title={this.props.tooltipLabel} followCursor>
        <Chip
          color="success"
          label={this.props.chipLabel}
          sx={{
            width: "100%",
            height: "20px",
            fontSize: "0.75rem",
          }}
        />
      </Tooltip>
    );
  }
}

export default TableChip;
