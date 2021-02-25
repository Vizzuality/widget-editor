export type Id = string;

export interface Payload {
  id: Id;
  name: string;
  tableName: string;
  provider: string;
  /** When type is raster, the core doesn't call the adapter's getDatasetFields */
  type: 'tabular' | 'raster';
  geoInfo: boolean;
  relevantFields: string[];
  metadata: {
    columns: {
      columnName: string;
      alias?: string;
      description?: string;
    }[]
  };
}

export type Data = { [key: string]: unknown }[];

export enum FieldType {
  Number = 'number',
  String = 'string',
  Date = 'date',
  Boolean = 'boolean',
  Array = 'array',
};

export type Field = {
  columnName: string;
  type: FieldType;
  metadata: {
    alias?: string;
    description?: string;
  }
};

