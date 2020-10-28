import { CategoryIcon, NumberIcon, DateIcon, UnknownIcon } from '@widget-editor/shared';
import AGGREGATION_OPTIONS from "@widget-editor/shared/lib/constants/aggregations";

/**
 * Return the type icon component
 * @param {string} type Type of the column
 */
const getTypeIcon = (type) => {
  let Icon;
  switch (type) {
    case 'string':
      Icon = CategoryIcon;
      break;
    case 'number':
      Icon = NumberIcon;
      break;
    case 'date':
      Icon = DateIcon;
      break;
    default:
      Icon = UnknownIcon;
  }

  return Icon;
};

/**
 * Whether to show the full table or the widget's data
 */
export const showFullTable = (category, value) => !category || !value;

/**
 * Return the display name of the aggregate function
 * @param {string} aggregateFunction Aggregation function
 */
export const getAggregationName = (aggregateFunction) => aggregateFunction
  ? AGGREGATION_OPTIONS.find(o => o.value === aggregateFunction)?.label
  : null;

/**
 * Return the list of relevant columns
 * @returns {{ [column: string]: { name: string, alias?: string, Icon: React.Component, aggregation?: boolean }}}
 */
export const getRelevantColumns = (category, value, color, aggregation, columnOptions) => {
  // If the user has not set the colunms required to build a chart, we want to show a full table
  if (showFullTable(category, value)) {
    const columns = columnOptions.reduce((res, option) => ({
      ...res,
      [option.value]: {
        name: option.label,
        Icon: getTypeIcon(option.type),
      },
    }), {});

    return columns;
  }

  const columns = {
    x: category ? { ...category, Icon: getTypeIcon(category.type) } : null,
    y: value ? { ...value, Icon: getTypeIcon(value.type), aggregation } : null,
    color: color ? { ...color, Icon: getTypeIcon(color.type) } : null,
  };

  // We remove the columns that are not set by the user
  Object.keys(columns).forEach(key => {
    if (!columns[key]) {
      delete columns[key];
    }
  });

  // If the user has chosen the same column for the X and Y axis, and there is not an aggregation,
  // we avoid displaying the column twice in the table
  if (columns.x?.name && columns.x?.name === columns.y?.name && !aggregation) {
    delete columns.y;
  }

  // If the user has chosen the same column for the X axis and color, or the user has chosen the
  // same column for the Y axis and color and there is not an aggregation, we also remove the
  // color column to avoid displaying it twice in the table
  if ((columns.x?.name && columns.x?.name === columns.color?.name)
    || (columns.y?.name && columns.y?.name === columns.color?.name && !aggregation)) {
    delete columns.color;
  }

  return columns;
};