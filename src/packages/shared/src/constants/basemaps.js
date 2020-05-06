const BASEMAPS = {
  dark: {
    id: "dark",
    value:
      "https://api.mapbox.com/styles/v1/resourcewatch/cjhqgjq1908ar2smep2wd7wf7/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w",
    label: "Dark",
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
  light: {
    id: "light",
    value:
      "https://api.mapbox.com/styles/v1/resourcewatch/cjhqgk77j0r7h2sqw220p7imy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w",
    label: "Light",
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
  satellite: {
    id: "satellite",
    value:
      "https://api.mapbox.com/styles/v1/resourcewatch/cjhqiecof53wv2rl9gw4cehmy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w",
    label: "Satellite",
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
  terrain: {
    id: "terrain",
    value:
      "https://api.mapbox.com/styles/v1/resourcewatch/cjhqi456h02pg2rp6w2mwp61c/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w",
    label: "Terrain",
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
};

export default BASEMAPS;
