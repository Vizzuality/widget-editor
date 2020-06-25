import * as Vega from "./vega";
import * as Generic from "./generic";

export interface Bars {
  setAxes(): object;
  setScales(): Generic.ObjectPayload;
  setMarks(): Generic.ObjectPayload;
  bindData(): Generic.ObjectPayload;
  generateSchema(): void;
  setGenericSettings(): void;
}

export interface Pie {
  setScales(): Generic.ObjectPayload;
  setMarks(): Generic.ObjectPayload;
  bindData(): Generic.ObjectPayload;
  generateSchema(): void;
  setGenericSettings(): void;
}

export interface Line {
  setAxes(): object;
  setScales(): Generic.ObjectPayload;
  setMarks(): Generic.ObjectPayload;
  bindData(): Generic.ObjectPayload;
  generateSchema(): void;
  setGenericSettings(): void;
}

export interface Scatter {
  setAxes(): object;
  setScales(): Generic.ObjectPayload;
  setMarks(): Generic.ObjectPayload;
  bindData(): Generic.ObjectPayload;
  generateSchema(): void;
  setGenericSettings(): void;
}

export interface Service {
  schema: Vega.Schema;
  sliceCount: number;
  widgetConfig: object;
  widgetData: object;
  resolveChart(): void;
  setConfig(): void;
  getChart(): Vega.Schema;
}
