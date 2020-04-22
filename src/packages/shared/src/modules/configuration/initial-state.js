export default {
  title: "",
  caption: "",
  format: "",
  visualizationType: "chart",
  chartType: "bar",
  slizeCount: 5,
  donutRadius: 100,
  xAxisTitle: null,
  yAxisTitle: null,
  availableCharts: [
    { value: "pie", chartType: "pie", label: "Pie" },
    { value: "donut", chartType: "donut", label: "Donut" },
    {
      value: "bar-horizontal",
      chartType: "bar",
      label: "Bar (Horizontal)",
    },
    {
      value: "bar-vertical",
      chartType: "bar_vertical",
      label: "Bar (Vertical)",
    },
    { value: "line", chartType: "line", label: "Line" },
    {
      value: "scatter",
      chartType: "scatter",
      label: "Scatter",
    },
    {
      value: "map",
      chartType: "map",
      label: "Map",
    },
  ],
};
