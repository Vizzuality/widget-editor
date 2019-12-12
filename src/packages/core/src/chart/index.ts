import { Chart } from "@packages/types";

export default class ChartService implements Chart {
  getVisualisation(
    dataset: object,
    widget: object,
    fields: object,
    layers: object
  ) {
    console.log("getVisualisation", dataset, widget, fields, layers);

    return {
      color: "red"
    };
  }
}
