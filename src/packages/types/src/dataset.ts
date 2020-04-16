import * as Dataset from './dataset';
import * as Widget from './widget';

type Id = string | null;
type Url = string;
type Query = string;
type ColumnName = string;
type TableName = string;
type Geostore = string;

export interface Payload {
  attributes: {
    provider: string;
    tableName: string;
    metadata: any;
    widget: Widget.Payload[] | null;
  };
  id: Id;
}

export interface Service {
  fetchData(url: Url): Promise<[Dataset.Payload]>;
  fetchFilteredData?(query: Query): [object];
  getFields?(): [object];
  getLayers?(): [object];
  getLayer?(): object;
  getSimilarDatasets?(): [object];
  getColumnMinAndMax?(
    columnName: ColumnName,
    tableName: TableName,
    geostore: Geostore
  ): object;
  getColumnValues?(): [object];
}
