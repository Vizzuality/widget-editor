export const defaultVegaSchema = () => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 100,
    height: 100,
    data: [],
    legend: [],
    config: [],
    signals: [],
    scales: [],
    axes: [],
    marks: [],
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
    line: {
      interpolate: "linear",
      stroke: "#3BB2D0",
      fillOpacity: 0
    }
  };
};

// XXX: This makes it easier to construct our charts
// This is used in @core/services/filters when we recive data
// This makes it easier to know what field names to use in our vega configs
// And we can in the @core/services/filters modify our querries saftly
export const sqlFields = {
  value: "x",
  category: "y"
};

export default {
  defaultVegaSchema,
  sqlFields
};
