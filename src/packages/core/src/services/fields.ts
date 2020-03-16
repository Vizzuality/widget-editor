import { Config } from "@packages/types";

import capitalize from "../helpers/capitalize";

export default class FieldsService {
  configuration: Config.Payload;
  datasetId: String;
  fields: any;

  NUMERIC_TYPE = "number";
  COLUMN_TYPE = "string";

  constructor(configuration: Config.Payload, datasetId: string, fields: any) {
    this.configuration = configuration;
    this.datasetId = datasetId;
    this.fields = fields;
  }

  private query(q) {
    return fetch(
      `https://api.resourcewatch.org/v1/query/${this.datasetId}?${q}`
    )
      .then(response => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }

  // TODO: Geostore
  private getColumnMinAndMax(field: any) {
    const { columnName } = field;
    const tableName = this.configuration.value.tableName;
    const query = `SELECT MIN(${columnName}) AS min, MAX(${columnName}) AS max FROM ${tableName}`;

    return this.query(`sql=${query}`).then(data => (data ? data[0] : {}));
  }

  // TODO: Geostore
  private getColumnValues(field, uniq = true) {
    const { columnName } = field;
    const tableName = this.configuration.value.tableName;

    const uniqQueryPart = uniq ? `GROUP BY ${columnName}` : "";
    const query = `SELECT ${columnName} FROM ${tableName} ${uniqQueryPart} ORDER BY ${columnName}`;

    return this.query(`sql=${query}`).then(data =>
      (data || []).map(d => d[columnName])
    );
  }

  async getFieldInfo(field: any, column: string) {
    const selectedField = this.fields.find(f => f.columnName === column);

    if (selectedField.type === this.NUMERIC_TYPE) {
      const res = await this.getColumnMinAndMax(selectedField);
      return res;
    }

    if (selectedField.type === this.COLUMN_TYPE) {
      const res = await this.getColumnValues(selectedField);
      return res.map(r => ({ value: r, label: capitalize(r) }));
    }

    return "Hello world";
  }
}
