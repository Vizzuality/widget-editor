export const defaultVegaSchema = () => {
  return {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 400,
    height: 200,
    padding: 5,
    data: [],
    legend: [],
    config: [],
    signals: [],
    scales: [],
    axes: [],
    marks: []
  };
};

export default {
  defaultVegaSchema
};
