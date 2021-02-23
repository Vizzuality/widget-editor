import { Widget } from "@widget-editor/types";

export type APIDatasetPayload = {
  data: {
    id: string;
    attributes: {
      name: string,
      tableName: string,
      provider: string,
      geoInfo: boolean,
      widgetRelevantProps: string[],
      metadata: {
        attributes: {
          columns?: {
            [columnName: string]: {
              alias?: string,
              description?: string,
            },
          },
        },
      }[],
    },
  },
};

export type APIWidgetPayload = {
  data: {
    id: string;
    attributes: {
      name: string;
      description: string;
      dataset: string;
      widgetConfig: Widget.WidgetConfig,
      metadata: {
        attributes: {
          info?: {
            caption: string,
          },
        },
      }[],
    },
  },
};

export type APILayerDef = {
  id: string;
  attributes: {
    name: string;
    description: string;
    dataset: string;
    provider: string;
    default: boolean;
    layerConfig: { [key: string]: unknown };
    legendConfig: { [key: string]: unknown };
    interactionConfig: { [key: string]: unknown };
  }
};

export type APILayerPayload = {
  data: APILayerDef
};

export type APILayersPayload = {
  data: APILayerDef[]
};

export type APIFieldsPayload = {
  fields: {
    [fieldName: string]: {
      type: string;
    }
  }
};

export type APIGeostorePayload = {
  data: {
    name: string;
    geostoreId: string;
  }[]
};

export type APIAreaPayload = {
  data: {
    attributes: {
      name: string;
      geostore: string;
    }
  }[]
};

export type APIQueryPayload = {
  data: { [key: string]: unknown }[]
};