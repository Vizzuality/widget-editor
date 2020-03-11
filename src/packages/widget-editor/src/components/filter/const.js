import React from "react";

export const TYPE_RANGE = "range";
export const TYPE_VALUE = "value";
export const TYPE_COLUMNS = "columns";
export const TYPE_INDICATOR = "indicator";

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

export const FILTER_TYPES = [
  { label: "Between", value: TYPE_RANGE },
  { label: "Equals", value: TYPE_VALUE }
];

export const DEFAULT_FILTERS = [
  DEFAULT_RANGE_FILTER,
  DEFAULT_VALUE_FILTER,
  DEFAULT_COLUMNS_FILTER,
  FILTER_TYPES,
  COLUMN_FILTER_GROUP
];
