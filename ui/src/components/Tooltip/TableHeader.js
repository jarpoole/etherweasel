import React from "react";
import Tooltip from "@mui/material/Tooltip";

class TableHeader extends React.Component {
  render() {
    return this.props.tooltipLabel ? (
      <Tooltip title={this.props.tooltipLabel} followCursor>
        <h3 className="tableHeader" style={{ width: "fit-content" }}>
          {this.props.header}
        </h3>
      </Tooltip>
    ) : (
      <h3 className="tableHeader">{this.props.header}</h3>
    );
  }
}

export default TableHeader;
