type Id = string | number;

export default interface Widget {
  fromDataset(dataset: object): object; // TODO: Define widget syntax
  fetchWidget(widgetId: Id): Promise<[object]>;
}
