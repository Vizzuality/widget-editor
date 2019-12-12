/**
 * It returns a string query using filters Data
 * @param  {Array} filters
 * @return {String}
 */

/* eslint-disable max-len */
/**
 * Return the query to fetch the data of the dataset
 * @export
 * @param {string} tableName Name of the table
 * @param {string} provider - Name of the provider
 * @param {{ name: string, type: string, value: any[] }[]} [filters=[]]
 * @param {{ key: string, value: string, as?: boolean, aggregateFunction: string, group: boolean }} [arrColumns=[]]
 * @param {any} [arrOrder=[]]
 * @param {'asc'|'desc'} sortOrder
 * @returns {string} SQL query
 */
/* eslint-enable max-len */
export default function getQueryByFilters(
  tableName: string,
  provider: string,
  filters = [],
  arrColumns = [],
  arrOrder = [],
  sortOrder: string = "asc"
): string {
  // We compute the WHERE part of the query which corresponds
  // to the filters
  const filtersQuery = filters
    .map(filter => {
      if (filter.value === null || filter.value === undefined) {
        return null;
      }

      if (filter.type === "string") {
        let whereClause: string;
        switch (filter.operation) {
          case "contains":
            whereClause = `${filter.name} LIKE '%${filter.value}%'`;
            break;

          case "not-contain":
            whereClause = `${filter.name} NOT LIKE '%${filter.value}%'`;
            break;

          case "starts-with":
            whereClause = `${filter.name} LIKE '${filter.value}%'`;
            break;

          case "ends-with":
            whereClause = `${filter.name} LIKE '%${filter.value}'`;
            break;

          case "=":
            whereClause = `${filter.name} LIKE '${filter.value}'`;
            break;

          case "!=":
            whereClause = `${filter.name} NOT LIKE '${filter.value}'`;
            break;

          case "by-values":
          default:
            whereClause = `${filter.name} IN ('${filter.value.join("', '")}')`;
            break;
        }

        return filter.notNull
          ? `${whereClause} AND ${filter.name} IS NOT NULL`
          : whereClause;
      }

      if (filter.type === "number") {
        let whereClause: string;
        switch (filter.operation) {
          case "not-between":
            whereClause = `${filter.name} < ${filter.value[0]} OR ${filter.name} > ${filter.value[1]}`;
            break;

          case ">":
            whereClause = `${filter.name} > ${filter.value}`;
            break;

          case ">=":
            whereClause = `${filter.name} >= ${filter.value}`;
            break;

          case "<":
            whereClause = `${filter.name} < ${filter.value}`;
            break;

          case "<=":
            whereClause = `${filter.name} <= ${filter.value}`;
            break;

          case "=":
            whereClause = `${filter.name} = ${filter.value}`;
            break;

          case "!=":
            whereClause = `${filter.name} <> ${filter.value}`;
            break;

          case "between":
          default:
            whereClause = `${filter.name} >= ${filter.value[0]} AND ${filter.name} <= ${filter.value[1]}`;
            break;
        }

        return filter.notNull
          ? `${whereClause} AND ${filter.name} IS NOT NULL`
          : whereClause;
      }

      if (filter.type === "date") {
        let whereClause: string;
        const getSerializedValue = v =>
          provider === "featureservice"
            ? `date '${v.split("T")[0]}'`
            : `'${v}'`;

        switch (filter.operation) {
          case "not-between":
            whereClause = `${filter.name} < ${getSerializedValue(
              filter.value[0]
            )} OR ${filter.name} > ${getSerializedValue(filter.value[1])}`;
            break;

          case ">":
            whereClause = `${filter.name} > ${getSerializedValue(
              filter.value
            )}`;
            break;

          case ">=":
            whereClause = `${filter.name} >= ${getSerializedValue(
              filter.value
            )}`;
            break;

          case "<":
            whereClause = `${filter.name} < ${getSerializedValue(
              filter.value
            )}`;
            break;

          case "<=":
            whereClause = `${filter.name} <= ${getSerializedValue(
              filter.value
            )}`;
            break;

          case "=":
            whereClause = `${filter.name} = ${getSerializedValue(
              filter.value
            )}`;
            break;

          case "!=":
            whereClause = `${filter.name} <> ${getSerializedValue(
              filter.value
            )}`;
            break;

          case "between":
          default:
            whereClause = `${filter.name} >= ${getSerializedValue(
              filter.value[0]
            )} AND ${filter.name} <= ${getSerializedValue(filter.value[1])}`;
            break;
        }

        return filter.notNull
          ? `${whereClause} AND ${filter.name} IS NOT NULL`
          : whereClause;
      }

      return null;
    })
    .filter(filter => !!filter)
    .join(" AND ");

  // Get column names
  let columns = "*";
  if (arrColumns.length) {
    columns = arrColumns
      .map(column => {
        let res = `${column.value}`;

        // We eventually apply a aggregate function to the column
        if (column.aggregateFunction) {
          res = `${column.aggregateFunction.toUpperCase()}(${res})`;
        }

        // We eventually rename the column
        if (column.as) {
          res = `${res} as ${column.key}`;
        }

        return res;
      })
      .join(", ");
  }

  let orderBy: string = "";
  if (arrOrder.length) {
    const orders = arrOrder.map(order => order.name).join(" ");

    orderBy = `ORDER BY ${orders} ${sortOrder}`;
  }

  const where = filtersQuery.length ? `WHERE ${filtersQuery}` : "";

  // The column used to group the data, if exist
  const groupingColumns = arrColumns.filter(col => col.group);

  let groupBy: string = "GROUP BY ";
  groupingColumns.forEach(val => {
    groupBy = `${groupBy} ${val.key},`;
  });
  if (groupingColumns.length === 0) {
    groupBy = "";
  } else {
    groupBy = groupBy.slice(0, -1); // remove extra comma at the end
  }

  return encodeURIComponent(
    `SELECT ${columns} FROM ${tableName} ${where} ${groupBy} ${orderBy}`
  );
}
