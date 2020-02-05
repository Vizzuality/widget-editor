// TODO: This is used alot, move this to its own interface we can extend cross platform
export interface Schema {
  scales: {
    name: string;
    type?: string;
    domain?: object;
    range: { scheme: string } | string;
    padding?: number;
    round?: boolean;
    nice?: boolean;
  }[];
  width: number;
  height: number;
  config: object;
  legend: object[];
  marks: object[];
  axes: object[];
  data: object[];
}

export interface Vega {
  schema: Schema;
  widgetConfig: object;
  widgetData: object;
  configuration: object;
  resolveChart(): void;
  setConfig(): void;
  getChart(): Schema;
}

export interface Bars {
  setAxes(): object;
  setScales(): object[];
  setMarks(): object[];
  bindData(): object[];
}

export interface Pie {
  setScales(): object[];
  setMarks(): object[];
  bindData(): object[];
}

export interface Chart {
  schema: Schema;
  widgetConfig: object;
  widgetData: object;
  setGenericSettings(): void;
  generateSchema(): void;
  getChart(): Schema;
}
