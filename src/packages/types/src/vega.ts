export default interface VegaSchema {
  $schema: string;
  width: number;
  height: number;
  padding: number;
  data: {
    name: string;
    values: [object];
    transform: [object];
  };
  legend: [object];
  config: object;
  signals: [object];
  scales: [object];
  axes: [object];
  marks: [object];
}
