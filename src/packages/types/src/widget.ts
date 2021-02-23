import { Dataset, Filters, Layer } from ".";

export type Id = string;

export type ChartParamsConfig = {
  visualizationType: 'chart';
  limit: number;
  value: {
    format: string;
    name: string;
    type: Dataset.FieldType;
    alias?: string;
    description?: string;
  };
  category: {
    format: string;
    name: string;
    type: Dataset.FieldType;
    alias?: string;
    description?: string;
  };
  color?: null | {
    format: string;
    name: string;
    type: Dataset.FieldType;
    alias?: string;
    description?: string;
  };
  orderBy?: {
    name: string;
    type: Dataset.FieldType;
    alias?: string;
    description?: string;
    orderType: 'asc' | 'desc';
  };
  aggregateFunction: null | string;
  chartType: string;
  filters: Filters.SerializedFilter[],
  endUserFilters: Filters.EndUserFilter,
  areaIntersection: null | string,
  donutRadius: number;
  sliceCount: number;
}

export type MapParamsConfig = {
  visualizationType: 'map';
  layer: Layer.Id;
};

export type InteractionConfig = {
  name: string,
  config: {
    fields: {
      column: string,
      property: string,
      type: Dataset.FieldType,
      format?: string,
    }[],
  },
}[];

export type Legend = {
  type: 'color' | 'size',
  values: {
    label: string | number,
    value: string,
    type: Dataset.FieldType,
  }[],
}[];

export type Meta = {
  core: string,
  editor: string,
  renderer: string,
  adapter: string,
  advanced: boolean,
};

export type Scheme = {
  name: string;
  mainColor: string;
  category: string[];
};

export type SerializedScheme = {
  name?: string;
  range: {
    category20: string[];
    [key: string]: unknown;
  }
  [key: string]: unknown;
};

export interface WidgetConfig {
  type: string;
  paramsConfig?: {
    visualizationType: string;
  };
  we_meta: Meta;
  [key: string]: unknown;
};
export interface ChartWidgetConfig extends WidgetConfig {
  type: 'chart';
  paramsConfig: ChartParamsConfig;
  config: SerializedScheme;
  interaction_config: InteractionConfig;
  legend: Legend;
};

export interface MapWidgetConfig extends WidgetConfig {
  type: 'map';
  paramsConfig: MapParamsConfig;
  layer_id: Layer.Id;
  zoom: number;
  lat: number;
  lng: number;
  bounds: [number, number][];
  bbox: number[];
  basemapLayers: {
    basemap: string;
    labels: string;
    boundaries: boolean;
  };
};

export interface Payload {
  id: Id;
  name: string;
  description: string;
  datasetId: Dataset.Id;
  widgetConfig: WidgetConfig;
  metadata: {
    caption: string;
  };
}
