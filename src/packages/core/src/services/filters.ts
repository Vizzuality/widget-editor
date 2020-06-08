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

    this.prepareSelectStatement();
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

  resolveAggregate(column: string) {
    const { aggregateFunction } = this.configuration;

    if (aggregateFunction) {
      return `${aggregateFunction}(${column})`;
    }

    return column;
  }

  prepareSelectStatement() {
    const { category, value } = this.configuration;

    this.sql = `SELECT ${category.name} as ${
      sqlFields.value
    } ${this.prepareColor()}`;

    this.sql = `${this.sql}, ${this.resolveAggregate(value.name)} as ${
      sqlFields.category
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
    const { groupBy, aggregateFunction, chartType } = this.configuration;

    if (!!aggregateFunction) {
      this.sql = `${this.sql} GROUP BY x`;
      return;
    }

    if (groupBy) {
      const { name } = groupBy;
      this.sql = `${this.sql} GROUP BY ${name || sqlFields.value}`;
    } else if (
      (chartType === "pie" ||
      chartType === "donut" ||
      chartType === "line") && aggregateFunction !== null
    ) {
      this.sql = `${this.sql} GROUP BY ${sqlFields.value}`;
    }
  }

  prepareOrderBy() {
    const { orderBy, chartType, aggregateFunction } = this.configuration;

    if (!!aggregateFunction) {
      if (chartType === 'line') {
        this.sql = `${this.sql} ORDER BY ${this.configuration?.category?.name || 'y'}`;
      } else {
        this.sql = `${this.sql} ORDER BY y`;
      }
      return;
    }
  
    // If the user hasn't explicitely ordered the data, we still apply some default sorting
    // (which isn't shown in the UI) so the chart looks nice
    // The sorting depends on the type of the chart and the user can still override it manually
    if (orderBy) {
      const { name } = orderBy;
      this.sql = `${this.sql} ORDER BY ${name || sqlFields.category}`;
    } else if (chartType === "line" && this.configuration?.category?.name) {
      this.sql = `${this.sql} ORDER BY ${this.configuration.category.name}`;
    } else if (["pie", "donut", "bar", "stacked-bar", "bar-horizontal", "stacked-bar-horizontal"].indexOf(chartType) !== -1 && this.configuration?.value?.name) {
      this.sql = `${this.sql} ORDER BY ${this.configuration.value.name}`;
    }
  }

  prepareOrder() {
    const { orderBy, chartType, aggregateFunction } = this.configuration;
    
    if (orderBy) {
      const { orderType } = orderBy;
      this.sql = `${this.sql} ${orderType ? orderType : "asc"}`;
    } else if (
      chartType === "pie" ||
      chartType === "donut" ||
      chartType === "line"
    ) {
      this.sql = `${this.sql} desc`;
    } else if (aggregateFunction) {
      this.sql = `${this.sql} desc`;
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
      const values = filter[configuredValues] || 0;
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


// SELECT acq_date as x , count(frp) as y FROM vnp14imgtdl_nrt_global_7d WHERE frp >= 100 AND frp <= 857 GROUP BY x ORDER BY y desc LIMIT 7
// SELECT acq_date as x, COUNT(frp) as y FROM vnp14imgtdl_nrt_global_7d WHERE frp >= 100 AND frp <= 857 GROUP BY  x ORDER BY acq_date desc LIMIT 7