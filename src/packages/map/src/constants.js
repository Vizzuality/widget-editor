const LABELS = {
  none: {
    id: 'none',
    label: 'No labels',
    value: 'none',
  },
  light: {
    id: 'light',
    label: 'Labels light',
    value: 'light',
  },
  dark: {
    id: 'dark',
    label: 'Labels dark',
    value: 'dark',
  },
};

const BOUNDARIES = {
  dark: {
    id: "dark",
    label: "Show boundaries",
    value:
      "https://api.mapbox.com/styles/v1/resourcewatch/cjgcf8qdaai1x2rn6w3j4q805/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w",
  },
};

const BASEMAPS = {
  dark: {
    id: 'dark',
    value: 'dark',
    label: 'Dark',
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
  light: {
    id: 'light',
    value: 'light',
    label: 'Light',
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
  satellite: {
    id: 'satellite',
    value: 'satellite',
    label: 'Satellite',
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
  terrain: {
    id: 'terrain',
    value: 'terrain',
    label: 'Terrain',
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
};

const DEFAULT_VIEWPORT = {
  zoom: 2,
  latitude: 0,
  longitude: 0,
  pitch: 0,
  bearing: 0,
  transitionDuration: 250,
};

export { DEFAULT_VIEWPORT, LABELS, BOUNDARIES, BASEMAPS };

