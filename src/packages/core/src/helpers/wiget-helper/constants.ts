export const defaultVegaSchema = () => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 400,
    height: 279,
    data: [],
    legend: [],
    config: [],
    signals: [],
    scales: [],
    axes: [],
    marks: []
  };
};

// XXX: This makes it easier to construct our charts
// This is used in @core/services/filters when we recive data
// This makes it easier to know what field names to use in our vega configs
// And we can in the @core/services/filters modify our querries saftly
export const sqlFields = {
  value: "x",
  category: "y"
};

export default {
  defaultVegaSchema,
  sqlFields
};
