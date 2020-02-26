// Filter service is responsible for:
// Formating SQL string based on properties
// Request new data based on propertie configuration

import { Filters, Config } from "@packages/types";

import { sqlFields } from "../helpers/wiget-helper/constants";

export default class FiltersService implements Filters.Service {
  sql: string;
  configuration: Config.Payload;
  constructor(data: any) {
    this.configuration = data;
    this.sql = "";

    this.prepareSelectStatement();
    this.prepareAggregate();
    this.prepareGroupBy();
    this.prepareOrderBy();
    this.prepareOrder();
    this.prepareLimit();
  }

  prepareSelectStatement() {
    const { category } = this.configuration;
    this.sql = `SELECT ${category.name} as ${sqlFields.value}`;
  }

  prepareAggregate() {
    const { aggregateFunction, value } = this.configuration;
    const { name, tableName } = value;

    if (!aggregateFunction) {
      this.sql = `${this.sql}, ${name} as ${sqlFields.category} FROM ${tableName}`;
    } else {
      if (aggregateFunction.toUpperCase() === "SUM") {
        this.sql = `${this.sql}, SUM(${name}) as ${sqlFields.category} FROM ${tableName}`;
      } else {
        throw new Error(
          `Aggragate function (${aggregateFunction}) not implemented in filter service.`
        );
      }
    }
  }

  prepareGroupBy() {
    const { groupBy } = this.configuration;
    if (groupBy) {
      const { name } = groupBy;
      this.sql = `${this.sql} GROUP BY ${name || sqlFields.value}`;
    }
  }

  prepareOrderBy() {
    const { orderBy } = this.configuration;
    if (orderBy) {
      const { name } = orderBy;
      this.sql = `${this.sql} ORDER BY ${name || sqlFields.category}`;
    }
  }

  prepareOrder() {
    const { orderBy } = this.configuration;
    if (orderBy) {
      const { orderType } = orderBy;
      this.sql = `${this.sql} ${orderType || "desc"}`;
    }
  }

  prepareLimit() {
    const { limit = 500 } = this.configuration;
    this.sql = `${this.sql} LIMIT ${limit}`;
  }

  async requestWidgetData() {
    const {
      value: { datasetID }
    } = this.configuration;
    const response = await fetch(
      `https://api.resourcewatch.org/v1/query/${datasetID}?sql=${this.sql}`
    );
    const data = await response.json();
    return data;
  }
}
