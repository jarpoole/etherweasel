import React from "react";
import Paper from "@mui/material/Paper";
import { ResponsiveLine } from "@nivo/line";

import Formatter from "../../services/Formatter";

class LineGraph extends React.Component {
  render() {
    return (
      <Paper elevation={1} className="paperPadding">
        <h2 className="graphTitle">{this.props.title}</h2>
        <div className="lineGraphHeight">
          <ResponsiveLine
            data={Formatter.formatDataArray(
              this.props.data,
              this.props.interval
            )}
            margin={{
              top: 30,
              right: 30,
              bottom: 50,
              left: this.props.displayPercentage ? 50 : 60,
            }}
            xScale={{
              type: "linear",
              reverse: true,
            }}
            yScale={{
              type: "linear",
              min: "0",
              max: this.props.displayPercentage ? "100" : "auto",
              reverse: false,
            }}
            yFormat={(value) =>
              this.props.displayPercentage
                ? `${value}%`
                : Formatter.formatBytes(value, 2)
            }
            curve="cardinal"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              format: (value) => `${value} sec`,
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              tickValues: 8,
              legend: this.props.title,
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              format: (value) =>
                this.props.displayPercentage
                  ? `${value}%`
                  : Formatter.formatBytes(value),
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "",
              legendOffset: -45,
              legendPosition: "middle",
            }}
            enableGridX={false}
            colors={{ scheme: "pastel1" }}
            lineWidth={3}
            enablePoints={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            enableSlices="x"
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "row",
                justify: false,
                translateX: -10,
                translateY: -30,
                itemsSpacing: 45,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 16,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
              },
            ]}
          />
        </div>
      </Paper>
    );
  }
}

export default LineGraph;
