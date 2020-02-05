import * as Generic from './generic';

interface Axes {
  orient: string;
  scale: string;
}

interface Domain {
  data: string;
  field: string;
}

interface Scales {
  name: string;
  type?: string;
  domain: Domain;
  range: string | { scheme: string };
  padding?: number;
  nice?: boolean;
}

interface Encode {
  scale?: string;
  field?: string;
  band?: number;
  value?: number;
  signal?: string;
}

interface Marks {
  type: string;
  from: { data: string };
  encode: {
    enter: {
      x?: Encode;
      width?: Encode;
      y?: Encode;
      y2?: Encode;
      fill?: Encode;
    };
    update?: {
      fill?: { value: string };
      startAngle?: { field: string };
      endAngle?: { field: string };
      innerRadius?: { signal: string };
      outerRadius?: { signal: string };
    };
    hover?: {
      fill?: { value: string };
      opacity?: { value: number };
    };
  }
}

export interface Data {
  name?: string;
  values?: Generic.ObjectPayload;
  transform?: {
    type?: string;
    field?: string;
    startAngle?: number;
    endAngle?: number;
  }[];
}

export interface Schema {
  $schema: string;
  width: number;
  height: number;
  padding?: number;
  data: Data[];
  legend: Generic.ObjectPayload;
  config: Generic.ObjectPayload;
  signals: Generic.ObjectPayload;
  scales: Scales[];
  axes: Axes[];
  marks: Marks[];
}
