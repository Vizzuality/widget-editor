// Filter service is responsible for:
// Formating SQL string based on properties
// Request new data based on propertie configuration

// SELECT primary_fuel as x, SUM(estimated_generation_gwh) as y FROM powerwatch_data_20180102  GROUP BY  x ORDER BY y desc LIMIT 498

export default class Filters {
  sql: string;
  configuration: any;
  constructor(data: any) {
    console.log('filters service', data);
    this.configuration = data;
    this.sql = '';


    this.prepareSelectStatement();
    this.prepareAggregate();
    this.prepareGroupBy();
    this.prepareOrderBy();
    this.prepareOrder();
    this.prepareLimit();
    this.debugSql();
    this.requestWidgetData();
  }

  private prepareSelectStatement() {
    const { category } = this.configuration;
    this.sql = `SELECT ${category.name} as x`;
  }

  private prepareAggregate() {
    const { aggregateFunction, value } = this.configuration;
    const { name, tableName } = value;

    if (aggregateFunction.toUpperCase() === 'SUM') {
      this.sql = `${this.sql}, SUM(${name}) as y FROM ${tableName}`;
    } else {
      throw new Error(`Aggragate function (${aggregateFunction}) not implemented in filter service.`);
    }
  }

  private prepareGroupBy() {
    this.sql = `${this.sql} GROUP BY x`;
  }

  private prepareOrderBy() {
    this.sql = `${this.sql} ORDER BY y`;
  }

  private prepareOrder() {
    // TODO: Implement order
    this.sql = `${this.sql} desc`;
  }

  private prepareLimit() {
    const { limit = 500 } = this.configuration;
    this.sql = `${this.sql} LIMIT ${limit}`;
  }

  private debugSql() {
    console.info('sql query', this.sql);
  }

  private async requestWidgetData() {
    const { value: { datasetID } } = this.configuration;
    const response = await fetch(`https://api.resourcewatch.org/v1/query/${datasetID}?sql=${this.sql}`);
    const data = await response.json()
    return data;
  }

  getData() {

  }
}