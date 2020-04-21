import React from "react";

export const Line = () => (
  <svg width="70px" height="35px" viewBox="0 0 70 35" version="1.1">
    <g
      id="chart-sparkline"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="Group-13"
        transform="translate(6.000000, 2.000000)"
        strokeWidth="2"
      >
        <polyline
          id="Path"
          stroke="#3BB2D0"
          points="0 32 19.7727273 13.8 38.2272727 22.2 58 11"
        ></polyline>
        <polyline
          id="Path"
          stroke="#2C75B0"
          points="0 20.8695652 19.7727273 32 38.2272727 11.1304348 58 0"
        ></polyline>
      </g>
    </g>
  </svg>
);

export const Scatterplot = () => (
  <svg width="70px" height="35px" viewBox="0 0 70 35" version="1.1">
    <g
      id="chart-scatterplot"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="Group-15" transform="translate(11.000000, 6.000000)">
        <circle id="Oval" fill="#2C75B0" cx="3.5" cy="20.5" r="3.5"></circle>
        <circle
          id="Oval"
          fill="#3BB2D0"
          transform="translate(45.500000, 3.500000) rotate(-180.000000) translate(-45.500000, -3.500000) "
          cx="45.5"
          cy="3.5"
          r="3.5"
        ></circle>
        <circle
          id="Oval"
          fill="#3BB2D0"
          transform="translate(23.500000, 18.500000) rotate(-180.000000) translate(-23.500000, -18.500000) "
          cx="23.5"
          cy="18.5"
          r="3.5"
        ></circle>
        <circle
          id="Oval"
          fill="#3BB2D0"
          transform="translate(38.000000, 9.000000) rotate(-180.000000) translate(-38.000000, -9.000000) "
          cx="38"
          cy="9"
          r="2"
        ></circle>
        <circle
          id="Oval"
          fill="#3BB2D0"
          transform="translate(34.000000, 18.000000) rotate(-180.000000) translate(-34.000000, -18.000000) "
          cx="34"
          cy="18"
          r="2"
        ></circle>
        <circle
          id="Oval"
          fill="#3BB2D0"
          transform="translate(14.000000, 18.000000) rotate(-180.000000) translate(-14.000000, -18.000000) "
          cx="14"
          cy="18"
          r="2"
        ></circle>
        <circle
          id="Oval"
          fill="#3BB2D0"
          transform="translate(27.000000, 11.000000) rotate(-180.000000) translate(-27.000000, -11.000000) "
          cx="27"
          cy="11"
          r="2"
        ></circle>
        <circle
          id="Oval"
          fill="#3BB2D0"
          transform="translate(40.000000, 15.000000) rotate(-180.000000) translate(-40.000000, -15.000000) "
          cx="40"
          cy="15"
          r="2"
        ></circle>
        <circle id="Oval" fill="#2C75B0" cx="21.5" cy="7.5" r="3.5"></circle>
        <circle id="Oval" fill="#2C75B0" cx="9" cy="14" r="2"></circle>
        <circle id="Oval" fill="#2C75B0" cx="14" cy="10" r="2"></circle>
        <circle id="Oval" fill="#2C75B0" cx="30" cy="2" r="2"></circle>
        <circle id="Oval" fill="#2C75B0" cx="7" cy="9" r="2"></circle>
      </g>
    </g>
  </svg>
);

export const Donut = () => (
  <svg width="70px" height="35px" viewBox="0 0 70 35" version="1.1">
    <defs>
      <path
        d="M17.000408,0.00699401962 L17.0007338,8.01289404 C11.9861065,8.27253382 8,12.4207644 8,17.5 C8,22.7467051 12.2532949,27 17.5,27 C19.5656596,27 21.4773362,26.3407203 23.0360914,25.2210993 L28.6406118,30.9964293 C25.6142758,33.4973564 21.7326185,35 17.5,35 C7.83501688,35 0,27.1649831 0,17.5 C0,8.00210483 7.56645547,0.271450021 17.000408,0.00699401962 Z"
        id="path-1"
      ></path>
      <path
        d="M18.0006388,0.00702339299 C27.4341042,0.27202186 35,8.00245611 35,17.5 C35,22.3324916 33.0412458,26.7074916 29.8743687,29.8743687 L24.2175144,24.2175144 C25.9366763,22.4983526 27,20.1233526 27,17.5 C27,12.4213412 23.0147988,8.27347605 18.0009747,8.01298265 Z"
        id="path-3"
      ></path>
    </defs>
    <g
      id="chart-ring"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="Rectangle" transform="translate(18.000000, 0.000000)">
        <mask id="mask-2" fill="white">
          <use xlinkHref="#path-1"></use>
        </mask>
        <use id="Combined-Shape" fill="#3BB2D0" xlinkHref="#path-1"></use>
        <mask id="mask-4" fill="white">
          <use xlinkHref="#path-3"></use>
        </mask>
        <use id="Combined-Shape" fill="#2C75B0" xlinkHref="#path-3"></use>
      </g>
    </g>
  </svg>
);

export const Pie = () => (
  <svg width="70px" height="35px" viewBox="0 0 70 35" version="1.1">
    <defs>
      <circle id="path-1" cx="17.5" cy="17.5" r="17.5"></circle>
    </defs>
    <g
      id="chart-pie"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="Rectangle" transform="translate(18.000000, 0.000000)">
        <mask id="mask-2" fill="white">
          <use xlinkHref="#path-1" />
        </mask>
        <use id="Mask" fill="#3BB2D0" xlinkHref="#path-1" />
        <path
          d="M37.5,-1.5 L17.5,-1.5 L17.5,18.2071068 L37.5,38.2071068 L37.5,-1.5 Z"
          stroke="#F7F7F7"
          fill="#2C75B0"
          mask="url(#mask-2)"
        ></path>
      </g>
    </g>
  </svg>
);

export const ColumnVertical = () => (
  <svg width="70px" height="35px" viewBox="0 0 70 35" version="1.1">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Group-14" transform="translate(8.000000, 5.000000)">
        <rect fill="#2C75B0" x="0" y="0" width="38" height="4"></rect>
        <rect fill="#2C75B0" x="0" y="15" width="55" height="4"></rect>
        <rect fill="#3BB2D0" x="0" y="5" width="18" height="4"></rect>
        <rect fill="#3BB2D0" x="0" y="20" width="44" height="4"></rect>
      </g>
    </g>
  </svg>
);

export const ColumnHorizontal = () => (
  <svg width="70px" height="35px" viewBox="0 0 70 35" version="1.1">
    <g
      id="chart-columns-a"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="Group-13" transform="translate(8.000000, 3.000000)">
        <g id="Group-14">
          <rect fill="#2C75B0" x="0" y="15" width="4" height="13"></rect>
          <rect fill="#2C75B0" x="45" y="15" width="4" height="13"></rect>
          <rect fill="#2C75B0" x="15" y="5" width="4" height="23"></rect>
          <rect fill="#2C75B0" x="30" y="18" width="4" height="10"></rect>
          <rect fill="#3BB2D0" x="5" y="10" width="4" height="18"></rect>
          <rect fill="#3BB2D0" x="50" y="10" width="4" height="18"></rect>
          <rect fill="#3BB2D0" x="20" y="0" width="4" height="28"></rect>
          <rect fill="#3BB2D0" x="35" y="20" width="4" height="8"></rect>
        </g>
      </g>
    </g>
  </svg>
);

export const BarVertical = () => (
  <svg width="70px" height="35px" viewBox="0 0 70 35" version="1.1">
    <g
      id="chart-bars-b"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="Group-14" transform="translate(8.000000, 6.000000)">
        <rect fill="#2C75B0" x="0" y="0" width="27" height="8"></rect>
        <rect fill="#2C75B0" x="0" y="15" width="18" height="8"></rect>
        <rect fill="#3BB2D0" x="28" y="0" width="6" height="8"></rect>
        <rect fill="#3BB2D0" x="19" y="15" width="35" height="8"></rect>
      </g>
    </g>
  </svg>
);

export const BarHorizontal = () => (
  <svg width="70px" height="35px" viewBox="0 0 70 35" version="1.1">
    <g
      id="chart-columns-b"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="Group-14" transform="translate(10.000000, 3.000000)">
        <rect fill="#2C75B0" x="0" y="16" width="8" height="13"></rect>
        <rect fill="#2C75B0" x="42" y="16" width="8" height="13"></rect>
        <rect fill="#2C75B0" x="14" y="24" width="8" height="5"></rect>
        <rect fill="#2C75B0" x="28" y="19" width="8" height="10"></rect>
        <rect fill="#3BB2D0" x="0" y="10" width="8" height="5"></rect>
        <rect fill="#3BB2D0" x="42" y="10" width="8" height="5"></rect>
        <rect fill="#3BB2D0" x="14" y="0" width="8" height="23"></rect>
        <rect fill="#3BB2D0" x="28" y="5" width="8" height="13"></rect>
      </g>
    </g>
  </svg>
);
