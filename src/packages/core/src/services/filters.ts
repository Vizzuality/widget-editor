// Filter service is responsible for:
// Formating SQL string based on properties
// Request new data based on propertie configuration
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";

import { Filters, Config } from "@widget-editor/types";

import { getAdapter } from "../helpers/adapter";

import FieldsService from "./fields";

import { sqlFields } from "../helpers/wiget-helper/constants";

import filtersHelper from "../helpers/filters";

// TODO: Move async function to util
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export default class FiltersService implements Filters.Service {
  sql: string;
  dataset: any;
  configuration: Config.Payload;
  filters: any;

  constructor(configuration: any, filters: any, dataset: any) {
    this.configuration = configuration;
    this.filters = filters;
    this.sql = "";

    this.dataset = dataset;

    this.prepareSelectStatement();
    this.prepareAggregate();
    this.prepareFilters();
    this.prepareGroupBy();
    this.prepareOrderBy();
    this.prepareOrder();
    this.prepareLimit();
  }

  private resolveTableName() {
    // const { value, category } = this.configuration;
    // const { tableName: xTableName } = value;
    // const { tableName: yTableName } = category;
    return this.dataset.attributes.tableName;
  }

  prepareColor() {
    const { color } = this.configuration;
    if (isPlainObject(color)) {
      return `, ${color.identifier} as color`;
    }
    return "";
  }

  prepareSelectStatement() {
    const { category } = this.configuration;
    this.sql = `SELECT ${category.name} as ${
      sqlFields.value
    } ${this.prepareColor()}`;
  }

  prepareAggregate() {
    const { aggregateFunction, value } = this.configuration;
    const { name } = value;

    if (!aggregateFunction) {
      this.sql = `${this.sql}, ${name} as ${
        sqlFields.category
      } FROM ${this.resolveTableName()}`;
    } else {
      const aggregation = aggregateFunction.toUpperCase();
      if (aggregation === "SUM" || aggregation === "COUNT") {
        this.sql = `${this.sql}, ${aggregation}(${name}) as ${
          sqlFields.category
        } FROM ${this.resolveTableName()}`;
      } else {
        throw new Error(
          `Aggragate function (${aggregateFunction}) not implemented in filter service.`
        );
      }
    }
  }

  private escapeValue(value, dataType) {
    return dataType === "date" || dataType === "string" ? `'${value}'` : value;
  }

  private rangeCondition(
    sql: string,
    column: string,
    values: any,
    dataType: string
  ): string {
    let out = sql;
    return `${out} ${column} >= ${this.escapeValue(
      values[0],
      dataType
    )} AND ${column} <= ${this.escapeValue(values[1], dataType)}`;
  }

  private valueRange(
    sql: string,
    column: string,
    values: any,
    dataType: string
  ): string {
    let out = sql;

    if (!Array.isArray(values) || values.length === 0) {
      return `${out} ${column} IN ()`;
    }

    return `${out} ${column} IN (${values
      .map((v) => this.escapeValue(v.value, dataType))
      .join(",")})`;
  }

  private textContains(
    sql: string,
    column: string,
    values: any,
    dataType: string
  ): string {
    let out = sql;
    return `${out} ${column} = ${this.escapeValue(values, dataType)}`;
  }

  private valueEquals(
    sql: string,
    column: string,
    values: any,
    dataType: string
  ): string {
    let out = sql;
    return `${out} ${column} = ${this.escapeValue(values, dataType)}`;
  }

  private textNotContains(
    sql: string,
    column: string,
    values: any,
    dataType: string
  ): string {
    let out = sql;
    return `${out} ${column} != ${this.escapeValue(values, dataType)}`;
  }

  private textStartsWith(
    sql: string,
    column: string,
    values: any,
    dataType: string
  ): string {
    let out = sql;
    return `${out} (lower(${column}) LIKE '${values}%')`;
  }

  private textEndsWith(
    sql: string,
    column: string,
    values: any,
    dataType: string
  ): string {
    let out = sql;
    return `${out} (lower(${column}) LIKE '%${values}')`;
  }

  prepareFilters() {
    let out = this.sql;

    const filters = Array.isArray(this.filters) ? this.filters : this.filters?.list;

    if (filters && filters.length > 0) {
      out = `${out} WHERE `;
      filters.forEach((weFilter, index) => {
        const {
          indicator,
          column,
          dataType,
          filter: { values },
        } = weFilter;

        if (indicator === "range") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.rangeCondition(out, column, values, dataType);
        }
        if (indicator === "FILTER_ON_VALUES" && Array.isArray(values) && values.length > 0) {
          out = index > 0 ? `${out} AND ` : out;
          out = this.valueRange(out, column, values, dataType);
        }
        if (indicator === "TEXT_CONTAINS") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.textContains(out, column, values, dataType);
        }

        if (indicator === "TEXT_NOT_CONTAINS") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.textNotContains(out, column, values, dataType);
        }

        if (indicator === "TEXT_STARTS_WITH") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.textStartsWith(out, column, values, dataType);
        }

        if (indicator === "TEXT_ENDS_WITH") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.textEndsWith(out, column, values, dataType);
        }

        if (indicator === "value") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.valueEquals(out, column, values, dataType);
        }
      });
    }

    this.sql = out.replace(/ +(?= )/g, "");
  }

  prepareGroupBy() {
    const { groupBy, aggregateFunction } = this.configuration;
    if (groupBy) {
      const { name } = groupBy;
      this.sql = `${this.sql} GROUP BY ${name || sqlFields.value}`;
    } else if (aggregateFunction && aggregateFunction !== "none") {
      // If there's an aggregate function, we group the results
      // with the first column (dimension x)
      this.sql = `${this.sql} GROUP BY ${sqlFields.value}`;
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
      this.sql = `${this.sql} ${orderType ? orderType : "asc"}`;
    }
  }

  prepareLimit() {
    const { limit = 500 } = this.configuration;
    this.sql = `${this.sql} LIMIT ${limit}`;
  }

  async requestWidgetData() {
    if (!this.dataset.id) {
      throw new Error("Error, datasetId not present in Filters service.");
    }

    return [];

    const response = await fetch(
      `https://api.resourcewatch.org/v1/query/${this.dataset.id}?sql=${this.sql}`
    );

    const data = await response.json();
    return data;
  }

  getQuery() {
    return this.sql.replace(/ +(?= )/g, "");
  }

  static async handleFilters(filters, config, payload) {
    const {
      column: configuredColumn,
      type: configuredType,
      values: configuredValues,
    } = config;

    const { configuration, dataset, fields, widget } = payload;

    const out = [];

    const assignIndicator = (val) => {
      if (isPlainObject(val)) {
        return Object.keys(val).length === 2 ? "range" : "value";
      }
      return isArray(val) && val.length === 2 ? "range" : "value";
    };

    await asyncForEach(filters, async (filter, index) => {
      const values = filter[configuredValues] || 0;
      const column = filter[configuredColumn];
      const type = filter[configuredType];

      // Resolve metadata for current field
      const fieldService = new FieldsService(configuration, dataset, fields);

      out.push({
        column,
        indicator: assignIndicator(values),
        id: `we-filter-${column}-${index}`,
        exlude: !filter.operation,
        dataType: type,
        filter: {
          values: values,
          notNull: true,
        },
        fieldInfo: await fieldService.getFieldInfo(filter, column),
      });
    });

    return out;
  }

  static async patchFilters(filters, payload, configuration, dataset, fields) {
    const { values, id, type } = payload;
    const fieldService = new FieldsService(configuration, dataset, fields);

    const patch = await filtersHelper(filters, fieldService, payload);
    return patch;
  }
}
