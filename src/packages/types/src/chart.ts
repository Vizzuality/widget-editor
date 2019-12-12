interface Visualisation {
  color: string;
}

export default interface Chart {
  getVisualisation(
    dataset: object,
    widget: object,
    fields: object,
    layers: object
  ): Visualisation;
}
