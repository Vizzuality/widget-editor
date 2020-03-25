import { Config } from "@packages/types";

import capitalize from "../helpers/capitalize";

export default class FieldsService {
  configuration: Config.Payload;
  dataset: any;
  fields: any;

  NUMERIC_TYPE = "number";
  COLUMN_TYPE = "string";
  DATE_TYPE = "date";

  constructor(configuration: Config.Payload, dataset: string, fields: any) {
    this.configuration = configuration;
    this.dataset = dataset;
    this.fields = fields;
  }

  private query(q) {
    return fetch(
      // TODO: This url should come from adapter
      `https://api.resourcewatch.org/v1/query/${this.dataset.id}?${q}`
    )
      .then(response => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(jsonData => jsonData.data);
  }

  private getTableName() {
    // const { tableName: valueTableName } = this.configuration.value;
    // const { tableName: categoryTableName } = this.configuration.category;

    return this.dataset.attributes.tableName;
  }

  // TODO: Geostore
  private getColumnMinAndMax(field: any) {
    const { columnName } = field;
    const tableName = this.getTableName(true);

    const query = `SELECT MIN(${columnName}) AS min, MAX(${columnName}) AS max FROM ${tableName}`;

    return this.query(`sql=${query}`).then(data => (data ? data[0] : {}));
  }

  // TODO: Geostore
  private getColumnValues(field, uniq = true) {
    const { columnName } = field;
    console.log(field, "FIELD");
    const tableName = this.getTableName();

    const uniqQueryPart = uniq ? `GROUP BY ${columnName}` : "";
    const query = `SELECT ${columnName} FROM ${tableName} ${uniqQueryPart} ORDER BY ${columnName}`;

    return this.query(`sql=${query}`).then(data =>
      (data || []).map(d => d[columnName])
    );
  }

  async getFieldInfo(field: any, column: string) {
    const selectedField = this.fields.find(f => f.columnName === column);

    if (
      selectedField.type === this.NUMERIC_TYPE ||
      selectedField.type === this.DATE_TYPE
    ) {
      const res = await this.getColumnMinAndMax(selectedField);
      return res;
    }

    if (selectedField.type === this.COLUMN_TYPE) {
      const res = await this.getColumnValues(selectedField);
      return res.map(r => ({ value: r, label: capitalize(r) }));
    }

    return `${selectedField.type} Not implemented.`;
  }
}
