import React from "react";
import Paper from "@mui/material/Paper";
import { ResponsivePie } from "@nivo/pie";

class PieGraph extends React.Component {
  render() {
    return (
      <Paper
        className="paperPadding"
        style={{ paddingBottom: 12 }}
        elevation={1}
      >
        <h2 className="graphTitle">{this.props.title}</h2>
        <div className="pieGraphHeight">
          <ResponsivePie
            data={[
              { id: "Used", value: this.props.data },
              { id: "Free", value: 100 - this.props.data },
            ]}
            margin={{ top: 8, right: 30, bottom: 30, left: 30 }}
            valueFormat={(value) => `${value.toFixed(2)}%`}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: "pastel1" }}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            enableArcLinkLabels={false}
            arcLabel={(data) => `${data.value.toFixed(0)}%`}
            arcLabelsSkipAngle={45}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 30,
                itemsSpacing: 0,
                itemWidth: 60,
                itemHeight: 18,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: "circle",
              },
            ]}
          />
        </div>
      </Paper>
    );
  }
}
export default PieGraph;
