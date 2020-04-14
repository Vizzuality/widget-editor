import React from "react"; // General Filter structure types

export const TYPE_COLUMNS = "columns";
export const TYPE_INDICATOR = "indicator"; // Number types

export const TYPE_RANGE = "range";
export const TYPE_VALUE = "value"; // String types

export const TYPE_FILTER_ON_VALUES = "FILTER_ON_VALUES";
export const TYPE_TEXT_CONTAINS = "TEXT_CONTAINS";
export const TYPE_TEXT_NOT_CONTAINS = "TEXT_NOT_CONTAINS";
export const TYPE_TEXT_STARTS_WITH = "TEXT_STARTS_WITH";
export const TYPE_TEXT_ENDS_WITH = "TEXT_ENDS_WITH";
export const NUMBER_TYPES = [TYPE_RANGE, TYPE_VALUE];
export const STRING_TYPES = [TYPE_FILTER_ON_VALUES, TYPE_TEXT_CONTAINS, TYPE_TEXT_NOT_CONTAINS, TYPE_TEXT_STARTS_WITH, TYPE_TEXT_ENDS_WITH];
export const DEFAULT_RANGE_FILTER = {
  values: [0, 100],
  type: TYPE_RANGE,
  notNull: true,
  max: 500,
  min: 0
};
export const DEFAULT_VALUE_FILTER = {
  values: 0,
  type: TYPE_VALUE,
  notNull: true,
  max: 500,
  min: 0
};
export const DEFAULT_COLUMNS_FILTER = {
  values: [],
  type: TYPE_COLUMNS
};
export const COLUMN_FILTER_GROUP = {
  column: null,
  label: null,
  dataType: null,
  indicator: TYPE_RANGE,
  filter: DEFAULT_RANGE_FILTER
};
export const FILTER_NUMBER_INDICATOR_TYPES = [{
  label: "Between",
  value: TYPE_RANGE
}, {
  label: "Equals",
  value: TYPE_VALUE
}];
export const FILTER_STRING_INDICATOR_TYPES = [{
  label: "Filter by values",
  value: TYPE_FILTER_ON_VALUES
}, {
  label: "Text Contains",
  value: TYPE_TEXT_CONTAINS
}, {
  label: "Text does not contain",
  value: TYPE_TEXT_NOT_CONTAINS
}, {
  label: "Text starts with",
  value: TYPE_TEXT_STARTS_WITH
}, {
  label: "Text ends with",
  value: TYPE_TEXT_ENDS_WITH
}];
export const DEFAULT_FILTERS = [DEFAULT_RANGE_FILTER, DEFAULT_VALUE_FILTER, DEFAULT_COLUMNS_FILTER, FILTER_NUMBER_INDICATOR_TYPES, FILTER_STRING_INDICATOR_TYPES, COLUMN_FILTER_GROUP];