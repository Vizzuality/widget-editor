type Id = string | number;
type DatasetId = Id;

type Includes = string;
type Applications = [string];
type Query = string;
type ColumnName = string;
type TableName = string;
type Geostore = string;

export default interface Dataset {
  datasetId: DatasetId;
  fetchData(includes: Includes, applications: Applications): Promise<[object]>;
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
