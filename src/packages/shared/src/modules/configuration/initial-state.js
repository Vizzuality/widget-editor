export default {
  title: "",
  caption: "",
  format: "",
  visualizationType: "chart",
  rasterOnly: false,
  chartType: "bar",
  sliceCount: 5,
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
      value: "bar",
      chartType: "bar",
      label: "Columns",
    },
    {
      value: "stacked-bar",
      chartType: "stacked-bar",
      label: "Stacked columns",
    },
    {
      value: "bar-horizontal",
      chartType: "bar-horizontal",
      label: "Bars",
    },
    {
      value: "stacked-bar-horizontal",
      chartType: "stacked-bar-horizontal",
      label: "Stacked bars",
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
