import React from "react";

import Header from "../components/Header";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { StlViewer } from "react-stl-viewer";

const url = process.env.PUBLIC_URL + "/FinalRevisionMechanical.stl";

class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header
          title="Ether-Weasel"
          description="The power to shape the world is within your grasp."
        />
        <h2 className="subtitle">What is Ether-Weasel?</h2>
        <Typography paragraph>
          To understand exactly what Ether-Weasel is, let us first try to
          understand the concept of a man-in-the-middle (MitM) attack. A MitM
          attack involves the insertion of an entity between two hosts that
          communicate with each other, call them Alice and Bob. This third
          entity, the ”man-in-the-middle”, is then able to interfere with the
          dialogue while remaining undetected. This has profound and immediate
          security impacts, because Alice still think they are speaking to Bob,
          and vice-versa.
        </Typography>
        <Typography paragraph>
          Ether-Weasel is a full-scale practical demonstration of such exploit
          on an Ethernet network. Various subsystems were amalgamated together
          to demonstrate the feasibility of such an attack. By doing so, we hope
          to raise awareness to the security concerns that can arise from
          routing cables in very low-security areas.
        </Typography>

        <h2 className="subtitle">Explore Ether-Weasel!</h2>
        <Grid container spacing={10} alignItems="stretch">
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <Paper
              elevation={1}
              className="paperPadding"
              style={{ height: 500 }}
            >
              <StlViewer
                orbitControls
                url={url}
                floorProps={{
                  gridWidth: 300,
                }}
                modelProps={{
                  color: "#0288d1",
                  positionX: 150,
                  positionY: 150,
                  ref: {
                    current: "[Circular]",
                  },
                  rotationX: 0,
                  rotationY: 0,
                  rotationZ: (200 / 180) * Math.PI,
                  scale: 1.5,
                }}
                style={{
                  backgroundColor: "white",
                  height: "100%",
                  width: "100%",
                }}
              />
            </Paper>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>

        <Typography paragraph style={{ marginTop: 16 }}>
          Special thanks to{" "}
          <Link href="https://github.com/CedricBohemier">Cédric Bohémier</Link>,{" "}
          <Link href="https://github.com/jarpoole">Jared Poole</Link>,{" "}
          <Link href="https://github.com/nreep">Nickolas Reepschlager</Link> and{" "}
          <Link href="https://github.com/PSYmoom">Symoom Islam Saad</Link> for
          making this project possible.
        </Typography>
      </React.Fragment>
    );
  }
}

export default Home;
