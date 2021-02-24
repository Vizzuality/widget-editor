export const BASE_STATE = {
  endUserFilters: null,
  theme: null,
  editor: {
    widgetData: [],
    advanced: false
  },
  configuration: {
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
  },
  filters: {
    orderBy: null,
    color: null,
    list: []
  }
};
