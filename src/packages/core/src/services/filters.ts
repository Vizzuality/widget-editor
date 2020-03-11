// Filter service is responsible for:
// Formating SQL string based on properties
// Request new data based on propertie configuration

import { Filters, Config } from "@packages/types";

import FieldsService from "./fields";

import { sqlFields } from "../helpers/wiget-helper/constants";

// constants
const TYPE_COLUMNS = "columns";
const TYPE_INDICATOR = "indicator";
const TYPE_VALUE = "value";
const TYPE_RANGE = "range";

const DEFAULT_RANGE_FILTER = {
  values: [0, 100],
  type: TYPE_RANGE,
  notNull: true,
  max: 500,
  min: 0
};

const DEFAULT_VALUE_FILTER = {
  values: 0,
  type: TYPE_VALUE,
  notNull: true,
  max: 500,
  min: 0
};

export default class FiltersService implements Filters.Service {
  sql: string;
  datasetId: string;
  configuration: Config.Payload;

  constructor(data: any, datasetId: string) {
    this.configuration = data;

    this.sql = "";

    this.datasetId = datasetId;
    this.prepareSelectStatement();
    this.prepareAggregate();
    this.prepareFilters();
    this.prepareGroupBy();
    this.prepareOrderBy();
    this.prepareOrder();
    this.prepareLimit();
  }

  prepareSelectStatement() {
    const { category } = this.configuration;
    this.sql = `SELECT ${category.name} as ${sqlFields.value}`;
  }

  private resolveTableName() {
    const { value, category } = this.configuration;
    const { tableName: xTableName } = value;
    const { tableName: yTableName } = category;

    if (!xTableName && !yTableName) {
      throw new Error(
        "Filters service: canot parse table name from value nor category."
      );
    }

    // XXX: We prioritize xTableName, not sure if thats correct.
    return xTableName ? xTableName : yTableName;
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

  // Range conditions gets constructed as key => value AND key <= value
  // This is true if we have two values in our filter
  private rangeCondition(
    condition: string,
    name: string,
    value: [number],
    type: string
  ): string {
    let range = condition;
    value.forEach((v, index) => {
      const serializeValue = type === "date" ? `'${v}'` : v;
      let statement = "";
      if (index === 0) {
        statement = `${name} >= ${serializeValue}`;
      } else if (index === 1) {
        statement = `${statement} AND ${name} <= ${serializeValue}`;
      }
      range = `${range} ${statement}`;
    });
    return range;
  }

  prepareFilters() {
    const { filters } = this.configuration;
    let filtersQuery = "WHERE";

    if (filters && Array.isArray(filters) && filters.length > 0) {
      filters.forEach(({ name, value, type }) => {
        const isRange = value && Array.isArray(value) && value.length === 2;
        if (isRange) {
          filtersQuery = this.rangeCondition(filtersQuery, name, value, type);
        } else {
          throw new Error(
            `Expected value range filter recived (${value.join()}), not yet implemented in filter service.`
          );
        }
      });
    }
    this.sql = `${this.sql} ${filtersQuery}`;
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
      this.sql = `${this.sql} ${orderType || "desc"}`;
    }
  }

  prepareLimit() {
    const { limit = 500 } = this.configuration;
    this.sql = `${this.sql} LIMIT ${limit}`;
  }

  async requestWidgetData() {
    if (!this.datasetId) {
      throw new Error("Error, datasetId not present in Filters service.");
    }

    const response = await fetch(
      `https://api.resourcewatch.org/v1/query/${this.datasetId}?sql=${this.sql}`
    );
    const data = await response.json();
    return data;
  }

  // TODO: Cleanup
  static async patchFilters(
    filters,
    payload,
    configuration,
    datasetId,
    fields
  ) {
    const { values, id, type } = payload;
    const fieldService = new FieldsService(configuration, datasetId, fields);

    let patch = [];

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    if (type === TYPE_COLUMNS) {
      await asyncForEach(filters, async filter => {
        if (filter.id === id) {
          const fieldInfo = await fieldService.getFieldInfo(
            filter,
            values.value
          );
          patch.push({
            ...filter,
            column: values.value,
            dataType: values.dataType,
            fieldInfo,
            filter: {
              ...filter.filter,
              ...(filter.indicator === "range"
                ? { values: [fieldInfo.min, fieldInfo.max] }
                : {})
            }
          });
        } else {
          patch.push(filter);
        }
      });
    }

    if (type === TYPE_INDICATOR) {
      // TODO: Check if value isset for current filter
      // Then we need to assign that value when modifying filter
      patch = filters.map(filter => {
        if (filter.id === id) {
          return {
            ...filter,
            indicator: values.value,
            filter:
              values.value === TYPE_RANGE
                ? {
                    ...DEFAULT_RANGE_FILTER,
                    values: [filter.fieldInfo.min, filter.fieldInfo.max]
                  }
                : { ...DEFAULT_VALUE_FILTER, values: filter.fieldInfo.max }
          };
        }
        return filter;
      });
    }

    if (type === TYPE_RANGE) {
      patch = filters.map(filter => {
        if (filter.id === id) {
          return { ...filter, filter: { ...filter.filter, values } };
        }
        return filter;
      });
    }

    if (type === TYPE_VALUE) {
      patch = filters.map(filter => {
        if (filter.id === id) {
          return { ...filter, filter: { ...filter.filter, values } };
        }
        return filter;
      });
    }

    console.log("TYPE", patch);

    return patch;
  }
}
