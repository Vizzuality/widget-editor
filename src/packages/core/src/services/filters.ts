// Filter service is responsible for:
// Formatting SQL string based on properties
// Request new data based on properties configuration
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";

import { Filters, Config, Generic, Adapter } from "@widget-editor/types";
import asyncForEach from "@widget-editor/shared/lib/helpers/async-foreach";

import { sqlFields } from "../helpers/wiget-helper/constants";
import FieldsService from "./fields";

export default class FiltersService implements Filters.Service {
  sql: string;
  additionalParams: [string, string][] = [];
  dataset: any;
  configuration: Config.Payload;
  adapter: Adapter.Service;
  filters: { list: Filters.Filter[], areaIntersection: string };
  endUserFilters: Filters.EndUserFilter[];

  constructor(store: any, adapter: Adapter.Service) {
    const { configuration, filters, editor: { dataset }, endUserFilters } = store;

    this.configuration = configuration;
    this.filters = filters;
    this.sql = "";
    this.adapter = adapter;
    this.endUserFilters = endUserFilters;

    this.dataset = dataset;

    if (this.hasRequiredFields()) {
      this.prepareSelectStatement();
      this.prepareFilters();
      this.prepareGroupBy();
      this.prepareOrderBy();
      this.prepareLimit();
      this.prepareGeostore();
    }
  }

  private hasRequiredFields() {
    return this.configuration?.value?.name && this.configuration?.category?.name;
  }

  private resolveTableName() {
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

  resolveEndUserFilters() {
    if (this.endUserFilters.length) {
      return `, ${this.endUserFilters}`;
    }

    return '';
  }

  prepareSelectStatement() {
    const { category, value } = this.configuration;

    this.sql = `SELECT ${category.name} as ${sqlFields.value} ${this.prepareColor()} ${this.resolveEndUserFilters()}`;

    this.sql = `${this.sql}, ${this.resolveAggregate(value.name)} as ${sqlFields.category} FROM ${this.resolveTableName()}`;
  }

  /**
   * Return the serialisation of the number filter as SQL (for the WHERE statement)
   * @param filter Number filter to serialize
   */
  private getNumberFilterQuery(filter: Filters.NumberFilter): string {
    const { column, operation, value } = filter;

    let sql;
    switch (operation) {
      case 'not-between':
        sql = `${column} < ${value[0]} OR ${column} > ${value[1]}`;
        break;

      case '>':
        sql = `${column} > ${value}`;
        break;

      case '>=':
        sql = `${column} >= ${value}`;
        break;

      case '<':
        sql = `${column} < ${value}`;
        break;

      case '<=':
        sql = `${column} <= ${value}`;
        break;

      case '=':
        sql = `${column} = ${value}`;
        break;

      case '!=':
        sql = `${column} <> ${value}`;
        break;

      case 'between':
      default:
        sql = `${column} >= ${value[0]} AND ${column} <= ${value[1]}`;
        break;
    }

    return sql;
  }

  /**
   * Return the serialisation of the date filter as SQL (for the WHERE statement)
   * @param filter Date filter to serialize
   */
  private getDateFilterQuery(filter: Filters.DateFilter): string {
    const { column, operation, value } = filter;
    const getSerializedValue = date => this.dataset.attributes.provider === 'featureservice'
      ? `date '${date.toISOString().split('T')[0]}'`
      : `'${date.toISOString()}'`;

    let sql;
    switch (operation) {
      case 'not-between':
        sql = `${column} < ${getSerializedValue(value[0])} OR ${column} > ${getSerializedValue(value[1])}`;
        break;

      case '>':
        sql = `${column} > ${getSerializedValue(value)}`;
        break;

      case '>=':
        sql = `${column} >= ${getSerializedValue(value)}`;
        break;

      case '<':
        sql = `${column} < ${getSerializedValue(value)}`;
        break;

      case '<=':
        sql = `${column} <= ${getSerializedValue(value)}`;
        break;

      case '=':
        sql = `${column} = ${getSerializedValue(value)}`;
        break;

      case '!=':
        sql = `${column} <> ${getSerializedValue(value)}`;
        break;

      case 'between':
      default:
        sql = `${column} >= ${getSerializedValue(value[0])} AND ${column} <= ${getSerializedValue(value[1])}`;
        break;
    }

    return sql;
  }

  /**
   * Return the serialisation of the string filter as SQL (for the WHERE statement)
   * @param filter String filter to serialize
   */
  private getStringFilterQuery(filter: Filters.StringFilter): string {
    const { column, operation, value } = filter;

    let sql;
    switch (operation) {
      case 'contains':
        sql = `${column} LIKE '%${value}%'`;
        break;

      case 'not-contain':
        sql = `${column} NOT LIKE '%${value}%'`;
        break;

      case 'starts-with':
        sql = `${column} LIKE '${value}%'`;
        break;

      case 'ends-with':
        sql = `${column} LIKE '%${value}'`;
        break;

      case '=':
        sql = `${column} LIKE '${value}'`;
        break;

      case '!=':
        sql = `${column} NOT LIKE '${value}'`;
        break;

      case 'by-values':
      default:
        sql = `${column} IN ('${(value as string[]).join('\', \'')}')`;
        break;
    }

    return sql;
  }

  // We allow the filter through if "notNull" is applied to filter
  // when calling prepareFilters, we will only apply not null operation if no value present
  // otherwise we apply both
  validateFilters(filters) {
    return filters.map(filter => {
      const hasValue = filter.value !== undefined && filter.value !== null
        && (!Array.isArray(filter.value) || filter.value.length > 0);
      const filterNullValues = filter.notNull;
      return {
        valid: hasValue || filter.notNull,
        hasValue,
        filter
      }
    });
  }

  prepareFilters() {
    let sql = this.sql;
    const filters = this.validateFilters(this.filters.list ?? []));
    const validFilters = filters.filter(f => f.valid);

    if (validFilters.length > 0) {
      sql = `${sql} WHERE `;

      validFilters.forEach(({ filter, hasValue }, index) => {
        const { column, type, notNull } = filter;

        sql = index > 0 ? `${sql} AND ` : sql;

        if (hasValue) {
          if (type === 'number') {
            sql = `${sql} ${this.getNumberFilterQuery(filter as Filters.NumberFilter)}`;
          } else if (type === 'date') {
            sql = `${sql} ${this.getDateFilterQuery(filter as Filters.DateFilter)}`;
          } else if (type === 'string') {
            sql = `${sql} ${this.getStringFilterQuery(filter as Filters.StringFilter)}`;
          }
        }

        if (notNull) {
          sql = `${sql} ${hasValue ? 'AND' : ''} ${column} IS NOT NULL`;
        }
      });
    }

    this.sql = sql.replace(/ +(?= )/g, "");
  }

  prepareGroupBy() {
    const { aggregateFunction, color } = this.configuration;

    if (!!aggregateFunction) {
      this.sql = `${this.sql} GROUP BY x`;

      // If the user has filled the color field, we also need to group by it only and only if
      // there's also an aggregation (source: v1)
      if (color?.name) {
        this.sql = `${this.sql}, color`;
      }

      return;
    }
  }

  prepareOrderBy() {
    const { orderBy, chartType, aggregateFunction } = this.configuration;

    // If the user hasn't explicitly ordered the data, we still apply some default sorting
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

  prepareGeostore() {
    const { areaIntersection } = this.filters;
    if (areaIntersection) {
      this.additionalParams.push(['geostore', areaIntersection]);
    }
  }

  getQuery() {
    return encodeURIComponent(this.sql.replace(/ +(?= )/g, ""));
  }

  getAdditionalParams() {
    if (this.additionalParams.length === 0) {
      return '';
    }

    return `&${this.additionalParams.map(param => `${param[0]}=${encodeURIComponent(param[1])}`).join('&')}`;
  }

  /**
   * Return the deserialised filters allow with their configuration (values and/or minimum and
   * maximum)
   * @param adapter Adapter
   * @param filters Serialised filters
   * @param fields Dataset's fields
   * @param dataset Dataset object
   */
  static async getDeserializedFilters(
    adapter: Adapter.Service,
    filters: Filters.SerializedFilter[],
    fields: Generic.Array,
    dataset: any
  ): Promise<Filters.Filter[]> {
    const res = [];

    await asyncForEach(filters, async (filter, index) => {
      const { value, name: column, type, operation, notNull } = filter;

      // The default operation must match the default case of the getNumberFilterQuery,
      // getDateFilterQuery and getStringFilterQuery functions
      // A lot of widgets have operation undefined because in v1, we would default to the operation
      // below
      let defaultOperation = 'between'; // For type number and date
      if (type === 'string') {
        defaultOperation = 'by-values';
      }

      // Resolve metadata for current field
      const fieldService = new FieldsService(adapter, dataset, fields);

      let deserializedValue = value;
      if (type === 'date') {
        deserializedValue = Array.isArray(value) ? value.map(v => new Date(v)) : new Date(value);
      }

      res.push({
        id: `we-filter-${column}-${index}`,
        column,
        type,
        operation: operation ?? defaultOperation,
        value: deserializedValue,
        notNull,
        config: await fieldService.getFieldInfo(column),
      });
    });

    return res;
  }

  /**
   * Fetch the configuration of a filter i.e. it's possible values, min value, max value, etc.
   * @param adapter Adapter
   * @param dataset Dataset object
   * @param fields The fields of the dataset
   * @param fieldName Name of the column attached to the filter
   */
  static async fetchConfiguration(
    adapter: Adapter.Service,
    dataset: any, fields: any[],
    fieldName: string
  ) {
    const fieldService = new FieldsService(adapter, dataset, fields);
    const configuration = await fieldService.getFieldInfo(fieldName);
    return configuration;
  }
}
