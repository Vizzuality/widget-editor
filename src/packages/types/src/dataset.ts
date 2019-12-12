type Url = string;
type Query = string;
type ColumnName = string;
type TableName = string;
type Geostore = string;

export default interface Dataset {
  fetchData(url: Url): Promise<[object]>;
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
