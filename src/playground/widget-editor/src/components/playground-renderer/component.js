import React from "react";

import Renderer from "@widget-editor/renderer";

const widgetConfig = {
  autosize: {
    type: "pad",
    resize: true,
    contains: "padding",
  },
  data: [
    {
      name: "table",
      url:
        "https://api.resourcewatch.org/v1/query/b7148fae-fce4-4f25-8609-181077868acc?sql=SELECT year AS x, liquids, natural_gas, coal, nuclear, others FROM dash_energy_consumption_by_fuel ORDER BY year ASC",
      format: {
        type: "json",
        property: "data",
      },
      transform: [
        {
          type: "fold",
          as: ["c", "y"],
          fields: ["nuclear", "others", "coal", "natural_gas", "liquids"],
        },
        {
          type: "stack",
          groupby: ["x"],
          field: "y",
        },
        {
          type: "formula",
          as: "c",
          expr: "replace(upper(slice(datum.c,0,1))+slice(datum.c,1),/_/g,' ')",
        },
      ],
    },
  ],
  scales: [
    {
      name: "x",
      type: "band",
      range: "width",
      domain: {
        data: "table",
        field: "x",
      },
    },
    {
      name: "y",
      type: "linear",
      range: "height",
      nice: true,
      zero: true,
      domain: {
        data: "table",
        field: "y1",
      },
    },
    {
      name: "color",
      type: "ordinal",
      range: "category20",
      domain: ["Liquids", "Natural gas", "Coal", "Others", "Nuclear"],
    },
  ],
  axes: [
    {
      orient: "bottom",
      scale: "x",
      zindex: 1,
      labelOverlap: "parity",
      labelPadding: 6,
      encode: {
        labels: {
          update: {
            angle: {
              value: 90,
            },
            align: {
              value: "left",
            },
            baseline: {
              value: "middle",
            },
          },
        },
      },
    },
    {
      title: "Energy Demand (Btu, quadrillions)",
      orient: "left",
      scale: "y",
      zindex: 0,
      labelOverlap: "parity",
    },
  ],
  marks: [
    {
      type: "rect",
      from: {
        data: "table",
      },
      encode: {
        enter: {
          x: {
            scale: "x",
            field: "x",
          },
          width: {
            scale: "x",
            band: 1,
            offset: -1,
          },
          y: {
            scale: "y",
            field: "y0",
          },
          y2: {
            scale: "y",
            field: "y1",
          },
          fill: {
            scale: "color",
            field: "c",
          },
        },
        update: {
          fillOpacity: {
            value: 1,
          },
        },
        hover: {
          fillOpacity: {
            value: 0.5,
          },
        },
      },
    },
  ],
  legends: [
    {
      title: "Sector",
      fill: "color",
      orient: "right",
    },
  ],
  interaction_config: [
    {
      name: "tooltip",
      config: {
        fields: [
          {
            column: "y",
            property: "Energy Demand (Btu, quadrillions)",
            type: "number",
            format: ".2s",
          },
          {
            column: "c",
            property: "Sector",
            type: "string",
          },
          {
            column: "x",
            property: "Year",
            type: "string",
          },
        ],
      },
    },
  ],
};

const PlaygroundRenderer = ({ activeWidget }) => {
  if (!activeWidget) {
    return "Loading renderer...";
  }

  return (
    <div className="renderer-wrapper">
      <Renderer
        thumbnail={false}
        // widgetConfig={widgetConfig}
        widgetConfig={activeWidget.attributes.widgetConfig}
      />
    </div>
  );
};

export default PlaygroundRenderer;
