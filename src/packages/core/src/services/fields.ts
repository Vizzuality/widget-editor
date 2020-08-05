import { Generic } from "@widget-editor/types";
import { ALLOWED_FIELD_TYPES } from "../constants";

export default class FieldsService {
  dataset: any;
  fields: Generic.Array;

  NUMERIC_TYPE = "number";
  COLUMN_TYPE = "string";
  DATE_TYPE = "date";

  constructor(dataset: any, fields: Generic.Array) {
    this.dataset = dataset;
    this.fields = fields;
  }

  /**
   * Return the result of the SQL query performed against the dataset
   * @param sql SQL to execute
   */
  private query(sql: string) {
    // FIXME: This url should come from adapter
    return fetch(`https://api.resourcewatch.org/v1/query/${this.dataset.id}?sql=${sql}`)
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then((jsonData) => jsonData.data);
  }

  /**
   * Return the table name of the dataset
   */
  private getTableName(): string {
    return this.dataset.attributes.tableName;
  }

  /**
   * Return the minimum and maximum values of a field
   * If the field is of type `date`, the values will be timestamps
   * @param field Field for which we want to get the minimum and maximum value
   */
  private getColumnMinAndMax(field: any): Promise<{ min: number, max: number }> {
    const { columnName } = field;
    const tableName = this.getTableName();

    const query = `SELECT MIN(${columnName}) AS min, MAX(${columnName}) AS max FROM ${tableName}`;

    return this.query(query)
      .then((data) => (data?.length ? data[0] : {}));
  }

  /**
   * Return all the possible values of a field
   * @param field Field for which we want to get the values
   * @param uniq Whether duplicated values should be removed
   */
  private getColumnValues(field: any, uniq = true): Promise<string[]> {
    const { columnName } = field;
    const tableName = this.getTableName();


    const uniqQueryPart = uniq ? `GROUP BY ${columnName}` : "";
    const query = `SELECT ${columnName} FROM ${tableName} ${uniqQueryPart} ORDER BY ${columnName}`;

    return this.query(query)
      .then(data => (data ?? []).map(d => d[columnName]));
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

    const fieldType = ALLOWED_FIELD_TYPES.find(type => type.name === field.type)?.type ?? 'string';

    if (fieldType === this.NUMERIC_TYPE || fieldType === this.DATE_TYPE) {
      const res = await this.getColumnMinAndMax(field);
      return res;
    }

    if (fieldType === this.COLUMN_TYPE) {
      return {
        values: await this.getColumnValues(field)
      };
    }

    return null;
  }
}
