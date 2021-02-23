import { Dataset, Adapter } from "@widget-editor/types";

export default class FieldsService {
  constructor(
    private adapter: Adapter.Service,
    private dataset: Dataset.Payload,
    private fields: Dataset.Field[]
  ) { }

  /**
   * Return the result of the SQL query performed against the dataset
   * @param sql SQL to execute
   */
  private async query(sql: string) {
    return await this.adapter.getDatasetData(this.dataset.id, sql);
  }

  /**
   * Return the table name of the dataset
   */
  private getTableName(): string {
    return this.dataset.tableName;
  }

  /**
   * Return the minimum and maximum values of a field
   * If the field is of type `date`, the values will be timestamps
   * @param field Field for which we want to get the minimum and maximum value
   */
  public getColumnMinAndMax(field: Dataset.Field): Promise<{ min: number, max: number }> {
    const { columnName } = field;
    const tableName = this.getTableName();

    const query = `SELECT MIN(${columnName}) AS min, MAX(${columnName}) AS max FROM ${tableName}`;

    return this.query(query)
      .then((data) => (data?.length ? data[0] : {})) as Promise<{ min: number, max: number }>;
  }

  /**
   * Return all the possible values of a field
   * @param field Field for which we want to get the values
   * @param uniq Whether duplicated values should be removed
   */
  public getColumnValues(field: Dataset.Field, uniq = true): Promise<string[]> {
    const { columnName } = field;
    const tableName = this.getTableName();


    const uniqQueryPart = uniq ? `GROUP BY ${columnName}` : "";
    const query = `SELECT ${columnName} FROM ${tableName} ${uniqQueryPart} ORDER BY ${columnName}`;

    return this.query(query)
      .then(data => (data ?? [])
        .map(d => d[columnName])) as Promise<string[]>;
  }

  /**
   * Get information about a fields such as its possible values and/or minimum and maximum values
   * The information depends on the type of the field
   * @param fieldName Name of the field
   */
  async getFieldInfo(fieldName: string) {
    const field = this.fields.find((f) => f.columnName === fieldName);

    if (!field) {
      return null;
    }

    if (field.type === Dataset.FieldType.Number || field.type === Dataset.FieldType.Date) {
      const res = await this.getColumnMinAndMax(field);
      return res;
    }

    if (field.type === Dataset.FieldType.String) {
      return {
        values: await this.getColumnValues(field)
      };
    }

    return null;
  }
}
