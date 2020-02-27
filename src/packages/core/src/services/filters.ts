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

  prepareAggregate() {
    const { aggregateFunction, value } = this.configuration;
    const { name, tableName } = value;

    if (!aggregateFunction) {
      this.sql = `${this.sql}, ${name} as ${sqlFields.category} FROM ${tableName}`;
    } else {
      const aggregation = aggregateFunction.toUpperCase();
      if (aggregation === "SUM" || aggregation === "COUNT") {
        this.sql = `${this.sql}, ${aggregation}(${name}) as ${sqlFields.category} FROM ${tableName}`;
      } else {
        throw new Error(
          `Aggragate function (${aggregateFunction}) not implemented in filter service.`
        );
      }
    }
  }

  // Range conditions gets constructed as key => value AND key <= value
  // This is true if we have two values in our filter
  private rangeCondition(condition: string, name: string, value: [number]): string {
     let range = condition;
     value.forEach((v, index) => {
      let statement = '';
      if (index === 0) {
        statement = `${name} >= ${v}`;
      } else if (index === 1) {
        statement = `${statement} AND ${name} <= ${v}`;
      }
      range = `${range} ${statement}`;
    });
    return range;
  }

  prepareFilters() {
    const { filters } = this.configuration;
    let filtersQuery = 'WHERE';

    if (filters && Array.isArray(filters) && filters.length > 0) {
      filters.forEach(({ name, value }) => {
        const isRange = value && Array.isArray(value) && value.length === 2;
        if (isRange) {
          filtersQuery = this.rangeCondition(filtersQuery, name, value);
        } else {
          throw new Error(
            `Expected value range filter recived (${value.join()}), not yet implemented in filter service.`
          );
        }
      })
    }
    this.sql = `${this.sql} ${filtersQuery}`;
  }

  prepareGroupBy() {
    const { groupBy, aggregateFunction } = this.configuration;
    if (groupBy) {
      const { name } = groupBy;
      this.sql = `${this.sql} GROUP BY ${name || sqlFields.value}`; 
    } else if (aggregateFunction && aggregateFunction !== 'none') {
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
