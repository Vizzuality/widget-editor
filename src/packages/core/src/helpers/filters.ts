// Constants
const TYPE_COLUMNS = "columns";
const TYPE_INDICATOR = "indicator";
const TYPE_VALUE = "value";
const TYPE_RANGE = "range";
const TYPE_STRING = "string";

export const TYPE_FILTER_ON_VALUES = "FILTER_ON_VALUES";
export const TYPE_TEXT_CONTAINS = "TEXT_CONTAINS";
export const TYPE_TEXT_NOT_CONTAINS = "TEXT_NOT_CONTAINS";
export const TYPE_TEXT_STARTS_WITH = "TEXT_STARTS_WITH";
export const TYPE_TEXT_ENDS_WITH = "TEXT_ENDS_WITH";

const DEFAULT_STRING_FILTER = {
  values: "",
  type: null,
  notNull: false
};

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

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const patchColumn = async (filter, payload, fieldService) => {
  const { values, type } = payload;
  const fieldInfo = await fieldService.getFieldInfo(filter, values.value);

  // When column is patched
  // Modify filter with min,max values recived from the field service
  // If data type is string, we will use a list filter
  let setFilterOnColumn;

  if (values.dataType !== "string") {
    setFilterOnColumn = {
      ...filter.filter,
      values: [fieldInfo.min, fieldInfo.max]
    };
  } else {
    setFilterOnColumn = {
      ...filter.filter,
      type: "string",
      values: []
    };
  }

  return {
    ...filter,
    column: values.value,
    indicator: values.dataType === "string" ? "FILTER_ON_VALUES" : "range",
    dataType: values.dataType,
    fieldInfo,
    filter: setFilterOnColumn
  };
};

const resolveStringLikeValue = (val, isList = false) => {
  console.log("resolve value", val);
  if (isList) {
    return Array.isArray(val) ? val : [];
  }

  if (val === null) {
    return "";
  }

  return Array.isArray(val) ? val.map(v => v.label).join(",") : val;
};

const patchIndicator = (filter, payload) => {
  const { values } = payload;
  const { values: appliedValue } = filter.filter;

  // When an indicator is set
  // We want to set a default filter based on indicator type
  let setFilterOnIndicator = null;

  if (values.value === TYPE_FILTER_ON_VALUES) {
    setFilterOnIndicator = {
      ...DEFAULT_STRING_FILTER,
      notNull: true,
      values: resolveStringLikeValue(appliedValue, true)
    };
  } else if (
    values.value === TYPE_TEXT_CONTAINS ||
    values.value === TYPE_TEXT_NOT_CONTAINS ||
    values.value === TYPE_TEXT_STARTS_WITH ||
    values.value === TYPE_TEXT_ENDS_WITH
  ) {
    setFilterOnIndicator = {
      ...DEFAULT_STRING_FILTER,
      values: resolveStringLikeValue(appliedValue)
    };
  } else if (values.value === TYPE_RANGE) {
    setFilterOnIndicator = {
      ...DEFAULT_RANGE_FILTER,
      values:
        Array.isArray(appliedValue) && Array.isArray(appliedValue).length === 2
          ? appliedValue
          : [filter.fieldInfo.min, filter.fieldInfo.max]
    };
  } else if (values.value === TYPE_VALUE) {
    setFilterOnIndicator = {
      ...DEFAULT_VALUE_FILTER,
      values: filter.fieldInfo.max
    };
  } else {
    throw new Error(
      `Filters helper patch indicator, type ${values.value} is not a valid indicator.`
    );
  }

  return {
    ...filter,
    indicator: values.value,
    filter: setFilterOnIndicator
  };
};

const patchRange = (filter, payload) => {
  const { values } = payload;
  return { ...filter, filter: { ...filter.filter, values } };
};

const patchValue = (filter, payload) => {
  const { values } = payload;
  return { ...filter, filter: { ...filter.filter, values } };
};

const patchNullCheck = filter => {
  return {
    ...filter,
    filter: { ...filter.filter, notNull: !filter.filter.notNull }
  };
};

export default async (filters, fieldService, payload) => {
  const { values, id, type } = payload;

  let out = [];

  if (type === TYPE_COLUMNS) {
    await asyncForEach(filters, async filter => {
      if (filter.id === id) {
        const patch = await patchColumn(filter, payload, fieldService);
        out.push(patch);
      } else {
        out.push(filter);
      }
    });
  } else {
    out = filters.map(filter => {
      if (filter.id === id) {
        if (type === TYPE_INDICATOR) {
          return patchIndicator(filter, payload);
        } else if (type === TYPE_RANGE) {
          return patchRange(filter, payload);
        } else if (type === TYPE_VALUE || type === TYPE_FILTER_ON_VALUES) {
          return patchValue(filter, payload);
        } else if (type === "NOT_NULL_CHECK") {
          return patchNullCheck(filter);
        } else {
          throw new Error(
            `Error in filter helper type ${type} not implemented.`
          );
        }
      }
      return filter;
    });
  }

  return out;
};
