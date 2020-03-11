// Constants
const TYPE_COLUMNS = "columns";
const TYPE_INDICATOR = "indicator";
const TYPE_VALUE = "value";
const TYPE_RANGE = "range";
const TYPE_STRING = "string";

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
    indicator: values.dataType === "string" ? "list" : "range",
    dataType: type,
    fieldInfo,
    filter: setFilterOnColumn
  };
};

const patchIndicator = (filter, payload) => {
  const { values } = payload;

  // When an indicator is set
  // We want to set a default filter based on indicator type
  let setFilterOnIndicator = null;

  if (filter.indicator === "list") {
    setFilterOnIndicator = {
      ...filter.filter,
      values: [...values]
    };
  } else if (values.value === TYPE_RANGE) {
    setFilterOnIndicator = {
      ...DEFAULT_RANGE_FILTER,
      values: [filter.fieldInfo.min, filter.fieldInfo.max]
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
        } else if (type === TYPE_VALUE) {
          return patchValue(filter, payload);
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
