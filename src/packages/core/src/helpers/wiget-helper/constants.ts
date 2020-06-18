export const defaultVegaSchema = () => {
  return {
    $schema: "https://vega.github.io/schema/vega/v3.json",
    data: [],
    legend: [],
    config: {},
    signals: [
      {
        name: "width",
        value: "",
        on: [
          {
            events: {
              source: "window",
              type: "resize",
            },
            update: "containerSize()[0]*0.95",
          },
        ],
      },
      {
        name: "height",
        value: "",
        on: [
          {
            events: {
              source: "window",
              type: "resize",
            },
            update: "containerSize()[1]*0.95",
          },
        ],
      },
    ],
    autosize: {
      type: "fit",
      contains: "padding",
    },
    scales: [],
    axes: [],
    marks: [],
  };
};

// XXX: This makes it easier to construct our charts
// This is used in @core/services/filters when we recive data
// This makes it easier to know what field names to use in our vega configs
// And we can in the @core/services/filters modify our querries saftly
export const sqlFields = {
  value: "x",
  category: "y",
};

export default {
  defaultVegaSchema,
  sqlFields,
};
