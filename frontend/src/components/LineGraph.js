import React from "react";
import Paper from "@mui/material/Paper";
import { ResponsiveLine } from "@nivo/line";

const data = [
  {
    id: "signal A",
    data: [
      { x: "2018-01-01 12:00:01.100", y: 7 },
      { x: "2018-01-01 12:00:01.110", y: 5 },
      { x: "2018-01-01 12:00:01.120", y: 11 },
      { x: "2018-01-01 12:00:01.130", y: 9 },
      { x: "2018-01-01 12:00:01.140", y: 12 },
      { x: "2018-01-01 12:00:01.150", y: 16 },
      { x: "2018-01-01 12:00:01.160", y: 13 },
      { x: "2018-01-01 12:00:01.170", y: 13 },
      { x: "2018-01-01 12:00:01.180", y: 13 },
    ],
  },
  {
    id: "signal B",
    data: [
      { x: "2018-01-01 12:00:01.100", y: 5 },
      { x: "2018-01-01 12:00:01.110", y: 11 },
      { x: "2018-01-01 12:00:01.120", y: 9 },
      { x: "2018-01-01 12:00:01.130", y: 12 },
      { x: "2018-01-01 12:00:01.140", y: 16 },
      { x: "2018-01-01 12:00:01.150", y: 13 },
      { x: "2018-01-01 12:00:01.160", y: 13 },
      { x: "2018-01-01 12:00:01.170", y: 13 },
      { x: "2018-01-01 12:00:01.180", y: 7 },
    ],
  },
];

class LineGraph extends React.Component {
  render() {
    return (
      <Paper elevation={1} className="paperPadding">
        <h2 className="graphTitle">{this.props.title}</h2>
        <div className="lineGraphHeight">
          <ResponsiveLine
            data={data}
            margin={{ top: 30, right: 30, bottom: 50, left: 50 }}
            xScale={{
              type: "time",
              format: "%Y-%m-%d %H:%M:%S.%L",
              useUTC: false,
              precision: "millisecond",
            }}
            xFormat="time:%Y-%m-%d %H:%M:%S.%L"
            yScale={{
              type: "linear",
              min: "0",
              max: "auto",
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="cardinal"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              format: ".%L",
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "transportation",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "count",
              legendOffset: -40,
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
