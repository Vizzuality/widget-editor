import * as Payloads from "./payloads";

type Url = string;
type Query = string;
type ColumnName = string;
type TableName = string;
type Geostore = string;

export default interface Dataset {
  fetchData(url: Url): Promise<[Payloads.Payloads.Dataset]>;
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
