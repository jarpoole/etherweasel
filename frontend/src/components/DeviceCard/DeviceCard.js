import React from "react";

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

class DeviceCard extends React.Component {
  render() {
    return (
      <Card>
        <CardContent style={{ padding: "0" }}>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={0}
            style={{
              backgroundColor: "#1976d2",
              color: "#FFFFFF",
            }}
          >
            <div style={{ margin: "auto", padding: "8px 0 0 0" }}>
              {this.props.icon}
            </div>
            <Typography
              variant="h6"
              component="div"
              align="center"
              style={{ fontWeight: "bold", padding: "0 0 8px 0" }}
            >
              {this.props.title}
            </Typography>
          </Stack>
          {this.props.children}
        </CardContent>
      </Card>
    );
  }
}

export default DeviceCard;
