import * as Vega from "./vega";
import * as Generic from "./generic";

export interface Bars {
  setAxes(): object;
  setScales(): Generic.ObjectPayload;
  setMarks(): Generic.ObjectPayload;
  bindData(): Generic.ObjectPayload;
  generateSchema(): Promise<void>;
  setGenericSettings(): void;
}

export interface Pie {
  setScales(): Generic.ObjectPayload;
  setMarks(): Generic.ObjectPayload;
  bindData(): Generic.ObjectPayload;
  generateSchema(): Promise<void>;
  setGenericSettings(): void;
}

export interface Line {
  setAxes(): object;
  setScales(): Generic.ObjectPayload;
  setMarks(): Generic.ObjectPayload;
  bindData(): Generic.ObjectPayload;
  generateSchema(): Promise<void>;
  setGenericSettings(): void;
}

export interface Scatter {
  setAxes(): object;
  setScales(): Generic.ObjectPayload;
  setMarks(): Generic.ObjectPayload;
  bindData(): Generic.ObjectPayload;
  generateSchema(): Promise<void>;
  setGenericSettings(): void;
}

export interface Service {
  resolveChart(): Promise<void>;
  setConfig(): void;
  getChart(): Promise<Vega.Schema>;
}
