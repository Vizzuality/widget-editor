export default {
  title: "",
  caption: "",
  format: "",
  visualizationType: "chart",
  chartType: "bar",
  direction: "horizontal",
  xAxisTitle: null,
  yAxisTitle: null,
  availableCharts: [
    { value: "pie", chartType: "pie", direction: null, label: "Pie" },
    {
      value: "bar-horizontal",
      chartType: "bar",
      direction: "horizontal",
      label: "Bar (Horizontal)",
    },
    {
      value: "bar-vertical",
      chartType: "bar",
      direction: "vertical",
      label: "Bar (Vertical)",
    },
    { value: "line", chartType: "line", direction: null, label: "Line" },
    {
      value: "scatter",
      chartType: "scatter",
      direction: null,
      label: "Scatter",
    },
  ],
};
