import deepClone from "lodash/cloneDeep";

export const defaultTheme = {
  range: {
    dotSize: [20, 250],
    category20: [
      "#3BB2D0",
      "#2C75B0",
      "#FAB72E",
      "#EF4848",
      "#65B60D",
      "#C32D7B",
      "#F577B9",
      "#5FD2B8",
      "#F1800F",
      "#9F1C00",
      "#A5E9E3",
      "#B9D765",
      "#393F44",
      "#CACCD0",
      "#717171"
    ],
    ordinal: { scheme: "greens" },
    ramp: { scheme: "purples" }
  },
  axis: {
    labelFontSize: 13,
    labelFont: "Lato",
    labelColor: "#717171",
    labelPadding: 10,
    ticks: true,
    tickSize: 8,
    tickColor: "#A9ABAD",
    tickOpacity: 0.5,
    tickExtra: false
  },
  axisX: {
    bandPosition: 0.5,
    domainWidth: 1.2,
    domainColor: "#A9ABAD",
    labelAlign: "center",
    labelBaseline: "top"
  },
  axisY: {
    domain: false,
    labelAlign: "left",
    labelBaseline: "bottom",
    tickOpacity: 0.5,
    grid: true,
    ticks: false,
    gridColor: "#A9ABAD",
    gridOpacity: 0.5
  },
  mark: {
    fill: "#3BB2D0"
  },
  symbol: {
    fill: "#3BB2D0",
    stroke: "#fff"
  },
  rect: {
    fill: "#3BB2D0"
  },
  line: {
    interpolate: "linear",
    stroke: "#3BB2D0",
    fillOpacity: 0
  }
};

/**
 * Return the theme of the vega chart
 * @param {boolean} [thumbnail=false]
 * @return {object}
 */
export default function (thumbnail = false) {
  const theme: any = deepClone(defaultTheme);

  if (thumbnail) {
    // We remove the configuration of each of
    // the axes
    delete theme.axisX;
    delete theme.axisY;

    // We reduce the size of the dots
    theme.range.dotSize = [10, 150];

    // We hide the axes and their ticks and
    // labels
    theme.axis = {
      ticks: false,
      labels: false,
      grid: false,
      domainWidth: 0
    };
  }

  return theme;
}
