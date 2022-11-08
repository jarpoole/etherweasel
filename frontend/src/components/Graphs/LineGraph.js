import React from "react";
import Paper from "@mui/material/Paper";
import { ResponsiveLine } from "@nivo/line";

class LineGraph extends React.Component {
  formatData = (data) => {
    return data.map((y, i) => ({
      x: i * 5,
      y: y,
    }));
  };
  render() {
    return (
      <Paper elevation={1} className="paperPadding">
        <h2 className="graphTitle">{this.props.title}</h2>
        <div className="lineGraphHeight">
          <ResponsiveLine
            data={[
              { id: this.props.title, data: this.formatData(this.props.data) },
            ]}
            margin={{ top: 30, right: 30, bottom: 50, left: 50 }}
            xScale={{
              type: "linear",
              reverse: true,
            }}
            yScale={{
              type: "linear",
              min: "0",
              max: "100",
              reverse: false,
            }}
            yFormat={(value) => `${value}%`}
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
              format: (value) => `${value}%`,
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
                translateX: 0,
                translateY: -30,
                itemsSpacing: 0,
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
