export default {
  title: "",
  description: "",
  caption: "",
  format: "",
  visualizationType: "chart",
  chartType: "bar",
  sliceCount: 6,
  donutRadius: 100,
  limit: 50,
  map: {
    zoom: 2,
    lat: 0,
    lng: 0,
    bbox: null,
    basemap: {
      basemap: 'dark',
      labels: 'light',
      boundaries: false,
    },
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
