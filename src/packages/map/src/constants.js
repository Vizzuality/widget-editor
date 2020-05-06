const LABELS = {
  none: {
    id: "none",
    label: "No labels",
    value: "no_labels",
  },
  light: {
    id: "light",
    label: "Labels light",
    value:
      "https://api.mapbox.com/styles/v1/resourcewatch/cjgcf9rs05qnu2rrpp4qzucox/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w",
  },
  dark: {
    id: "dark",
    label: "Labels dark",
    value:
      "https://api.mapbox.com/styles/v1/resourcewatch/cjgcf9gqk9tmm2spd9zr0tml3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w",
  },
};

const BOUNDARIES = {
  dark: {
    id: "dark",
    label: "Boundaries",
    value:
      "https://api.mapbox.com/styles/v1/resourcewatch/cjgcf8qdaai1x2rn6w3j4q805/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w",
  },
};

export { LABELS, BOUNDARIES };
