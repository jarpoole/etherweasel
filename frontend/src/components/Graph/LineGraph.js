import React from "react";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import { ResponsiveLine } from "@nivo/line";
import { schemeTableau10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";

import Formatter from "../../services/Formatter";

const legendProps = {
  anchor: "top-right",
  direction: "row",
  justify: false,
  itemsSpacing: 5,
  itemHeight: 26,
  itemOpacity: 0.8,
  symbolShape: "circle",
};

class LineGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userHovering: false,
    };
  }

  formatDataset = (dataset, interval, colorScheme) =>
    dataset.map((data, index) =>
      Formatter.formatDataElement(data, interval, colorScheme(data.id))
    );

  render() {
    // Create color scheme
    let colorScheme = scaleOrdinal(schemeTableau10);
    let formattedDataset = this.formatDataset(
      this.props.dataset,
      this.props.interval,
      colorScheme
    );

    return (
      <Paper elevation={1} className="paperPadding">
        <h2 className="lineGraphTitle">{this.props.title}</h2>
        <div className="lineGraphHeight">
          {this.props.loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"95%"}
              sx={{ position: "relative", top: "5%" }}
            />
          ) : (
            <ResponsiveLine
              data={formattedDataset}
              colors={(data) => data.color}
              margin={{
                top: 50,
                right: 30,
                bottom: 30,
                left: this.props.displayPercentage ? 50 : 60,
              }}
              xScale={{
                type: "linear",
                reverse: true,
                min: "0",
                max:
                  (this.props.numberOfIntervals * this.props.interval) / 1000 -
                  1,
              }}
              yScale={{
                type: "linear",
                min: "0",
                max: this.props.max ? this.props.max : "auto",
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
                tickValues: 5,
              }}
              enableGridX={false}
              lineWidth={2.25}
              enablePoints={false}
              pointSize={10}
              pointBorderWidth={2}
              pointLabelYOffset={-12}
              enableSlices="x"
              useMesh={true}
              legends={
                Array.isArray(formattedDataset) && formattedDataset.length <= 6
                  ? [
                      {
                        ...legendProps,
                        itemWidth: this.props.itemWidth,
                        translateX: -10,
                        translateY: -35,
                      },
                    ]
                  : [
                      {
                        ...legendProps,
                        itemWidth: this.props.itemWidth,
                        translateX: -10,
                        translateY: -55,
                        data: formattedDataset
                          .slice(0, Math.floor(formattedDataset.length / 2))
                          .map((formattedData) => ({
                            id: formattedData.id,
                            label: formattedData.id,
                            color: formattedData.color,
                          })),
                      },
                      {
                        ...legendProps,
                        itemWidth: this.props.itemWidth,
                        translateX: -10,
                        translateY: -33,
                        data: formattedDataset
                          .slice(Math.floor(formattedDataset.length / 2))
                          .map((formattedData) => ({
                            id: formattedData.id,
                            label: formattedData.id,
                            color: formattedData.color,
                          })),
                      },
                    ]
              }
            />
          )}
        </div>
      </Paper>
    );
  }
}

export default LineGraph;
