// Filter service is responsible for:
// Formating SQL string based on properties
// Request new data based on propertie configuration
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";

import { Filters, Config } from "@widget-editor/types";

import FieldsService from "./fields";

import { sqlFields } from "../helpers/wiget-helper/constants";

import filtersHelper from "../helpers/filters";

import asyncForEach from "@widget-editor/shared/lib/helpers/async-foreach";

import aggregations from "@widget-editor/shared/lib/constants/aggregations";

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

    if (this.hasRequiredFields()) {
      this.prepareSelectStatement();
      this.prepareFilters();
      this.prepareGroupBy();
      this.prepareOrderBy();
      this.prepareLimit();
    }
  }

  private hasRequiredFields() {
    return this.configuration?.value?.name && this.configuration?.category?.name;
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
      return `, ${color.name} as color`;
    }
    return "";
  }

  resolveAggregate(column: string) {
    const { aggregateFunction } = this.configuration;

    if (aggregateFunction) {
      return `${aggregateFunction}(${column})`;
    }

    return column;
  }

  prepareSelectStatement() {
    const { category, value } = this.configuration;

    this.sql = `SELECT ${category.name} as ${sqlFields.value
      } ${this.prepareColor()}`;

    this.sql = `${this.sql}, ${this.resolveAggregate(value.name)} as ${sqlFields.category
      } FROM ${this.resolveTableName()}`;
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
    return `${out} ${column} LIKE \'%${values}%\'`;
  }

  private valueEquals(
    sql: string,
    column: string,
    values: any,
    dataType: string
  ): string {
    let out = sql;

    // If the user hasn't selected a value yet, we don't want the filter but we can't return an
    // empty string either because if the filter is not the first we would get something like:
    // SELECT * FROM XXX WHERE otherFilter = YYY AND LIMIT 50
    // Instead, we can use the condition 1 = 1 which is always true
    if (values === undefined || values === null) {
      return `${out} 1 = 1`;
    }

    if (Array.isArray(values)) {
      return `${out} ${column} IN (${values
        .map((v) => this.escapeValue(v, dataType))
        .join(",")})`;
    }

    return `${out} ${column} = ${this.escapeValue(values, dataType)}`;
  }

  private textNotContains(
    sql: string,
    column: string,
    values: any,
    dataType: string
  ): string {
    let out = sql;
    return `${out} ${column} NOT LIKE \'%${values}%\'`;
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

  notNullCheck(out, column, notNull = false) {
    if (notNull) {
      out = `${out} AND ${column} IS NOT NULL`;
    }
    return out;
  }

  prepareFilters() {
    let out = this.sql;

    const filters = Array.isArray(this.filters)
      ? this.filters
      : this.filters?.list;

    if (filters && filters.length > 0) {
      out = `${out} WHERE `;
      filters.forEach((weFilter, index) => {
        const {
          indicator,
          column,
          dataType,
          filter: { values, notNull },
        } = weFilter;

        if (indicator === "range") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.rangeCondition(out, column, values, dataType);
          out = this.notNullCheck(out, column, notNull);
        }
        if (
          indicator === "FILTER_ON_VALUES" &&
          Array.isArray(values) &&
          values.length > 0
        ) {
          out = index > 0 ? `${out} AND ` : out;
          out = this.valueRange(out, column, values, dataType);
          out = this.notNullCheck(out, column, notNull);
        }
        if (indicator === "TEXT_CONTAINS") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.textContains(out, column, values, dataType);
          out = this.notNullCheck(out, column, notNull);
        }

        if (indicator === "TEXT_NOT_CONTAINS") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.textNotContains(out, column, values, dataType);
          out = this.notNullCheck(out, column, notNull);
        }

        if (indicator === "TEXT_STARTS_WITH") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.textStartsWith(out, column, values, dataType);
          out = this.notNullCheck(out, column, notNull);
        }

        if (indicator === "TEXT_ENDS_WITH") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.textEndsWith(out, column, values, dataType);
          out = this.notNullCheck(out, column, notNull);
        }

        if (indicator === "value") {
          out = index > 0 ? `${out} AND ` : out;
          out = this.valueEquals(out, column, values, dataType);
          out = this.notNullCheck(out, column, notNull);
        }
      });
    }

    this.sql = out.replace(/ +(?= )/g, "");
  }

  prepareGroupBy() {
    const { groupBy, aggregateFunction, chartType, color } = this.configuration;

    if (!!aggregateFunction) {
      this.sql = `${this.sql} GROUP BY x`;

      // If the user has filled the color field, we also need to group by it only and only if
      // there's also an aggregation (source: v1)
      if (color?.name) {
        this.sql = `${this.sql}, color`;
      }

      return;
    }

    if (groupBy) {
      const { name } = groupBy;
      this.sql = `${this.sql} GROUP BY ${name || sqlFields.value}`;
    }
  }

  prepareOrderBy() {
    const { orderBy, chartType, aggregateFunction } = this.configuration;

    // If the user hasn't explicitely ordered the data, we still apply some default sorting
    // (which isn't shown in the UI) so the chart looks nice
    // The sorting depends on the type of the chart and the user can still override it manually
    let orderByField;
    if (orderBy) {
      const { name } = orderBy;
      orderByField = name || sqlFields.category;
    } else if (chartType === "line" && this.configuration?.category?.name) {
      orderByField = this.configuration.category.name;
    } else if (["pie", "donut", "bar", "stacked-bar", "bar-horizontal", "stacked-bar-horizontal"].indexOf(chartType) !== -1 && this.configuration?.value?.name) {
      orderByField = this.configuration.value.name;
    }

    // If the user sorts by a field that is aggregated, then, instead of ordering by the name of the
    // field, we order by its alias. The reason for doing this is that the API doesn't support
    // functions in the ORDER BY (ex: ORDER BY count(number)).
    // Nevertheless, if the user uses the same field for the category, value and order by fields,
    // then we understand the user wants to order, not by the aggregation, but by the raw value
    // instead (the category field). In that case, we don't replace the previous orderByField.
    if (aggregateFunction && orderByField === this.configuration?.value?.name
      && this.configuration?.category?.name !== orderByField) {
      orderByField = 'y';
    }

    if (orderByField) {
      this.sql = `${this.sql} ORDER BY ${orderByField} ${orderBy?.orderType || 'desc'}`;
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

    const response = await fetch(
      `https://api.resourcewatch.org/v1/query/${this.dataset.id}?sql=${this.sql}`
    );

    const data = await response.json();
    return data;
  }

  getQuery() {
    return encodeURIComponent(this.sql.replace(/ +(?= )/g, ""));
  }

  static async handleFilters(filters, config, payload) {
    const {
      column: configuredColumn,
      type: configuredType,
      values: configuredValues,
    } = config;

    const { configuration, dataset, fields, widget } = payload;

    const out = [];

    const assignIndicator = (val, filter) => {
      if (filter?.operation === "not-contain") {
        return "TEXT_NOT_CONTAINS";
      }

      if (filter?.operation === "contains") {
        return "TEXT_CONTAINS";
      }

      if (isPlainObject(val)) {
        return Object.keys(val).length === 2 ? "range" : "value";
      }
      return isArray(val) && val.length === 2 ? "range" : "value";
    };

    await asyncForEach(filters, async (filter, index) => {
      const values = filter[configuredValues] || undefined;
      const column = filter[configuredColumn];
      const type = filter[configuredType];

      // Resolve metadata for current field
      const fieldService = new FieldsService(configuration, dataset, fields);

      out.push({
        column,
        indicator: assignIndicator(values, filter),
        id: `we-filter-${column}-${index}`,
        exlude: !filter.operation,
        dataType: type,
        filter: {
          values: values,
          notNull: filter?.notNull || false,
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
