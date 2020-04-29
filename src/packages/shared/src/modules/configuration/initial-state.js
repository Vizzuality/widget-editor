export default {
  title: "",
  caption: "",
  format: "",
  visualizationType: "chart",
  rasterOnly: false,
  chartType: "bar",
  slizeCount: 5,
  donutRadius: 100,
  map: {
    zoom: 2,
    lat: 0,
    lng: 0,
    bbox: [0, 0, 0, 0],
    basemap: null,
  },
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
      value: "stacked-bar",
      chartType: "stacked-bar",
      label: "Stacked bar"
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
