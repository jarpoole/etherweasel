import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

class LoadingScreen extends React.Component {
  render() {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={this.props.open}
        onClick={this.props.handleLoadingClick}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
}
export default LoadingScreen;
