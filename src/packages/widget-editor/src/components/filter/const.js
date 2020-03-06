export const TYPE_RANGE = 'range';
export const TYPE_VALUE = 'value';
export const TYPE_COLUMNS = 'columns';

export const DEFAULT_RANGE_FILTER = {
    indicator: TYPE_RANGE,
    values: [0, 100],
    type: TYPE_RANGE,
    notNull: true,
    max: 500,
    min: 0
}

export const DEFAULT_VALUE_FILTER = {
    indicator: TYPE_VALUE,
    values: 0,
    type: TYPE_VALUE,
    notNull: true,
    max: 500,
    min: 0
}

export const DEFAULT_COLUMNS_FILTER = {
  indicator: TYPE_COLUMNS,
  values: [],
  type: TYPE_COLUMNS
}

export const DEFAULT_FILTERS = [
  DEFAULT_RANGE_FILTER,
  DEFAULT_VALUE_FILTER,
  DEFAULT_COLUMNS_FILTER
];