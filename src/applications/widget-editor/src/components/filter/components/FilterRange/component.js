import React from "react";

import QueryLimit from "components/query-limit";

import { TYPE_RANGE } from "components/filter/const";

// TODO: Move to utils
const UTCString = (utcString) =>
  new Date(utcString).toISOString().split("T")[0];
const ToUTCString = (date) => new Date(date).toISOString();

const FilterRange = ({ filter, disabled = false, setData }) => {
  const { values } = filter.filter;
  const { min, max } = filter.fieldInfo
    ? filter.fieldInfo
    : { min: 0, max: 100 };

  const [minValue, maxValue] = Array.isArray(values)
    ? values
    : (values, min, max);

  const onSetData = (values) => {
    let serializeValues;
    if (filter.dataType === "date") {
      serializeValues = [UTCString(values[0]), UTCString(values[1])];
    } else {
      serializeValues = values;
    }
    setData(serializeValues, filter.id, TYPE_RANGE);
  };

  const handleOnChangeValue = (value, key = "maxValue") => {
    let newValues;

    if (filter.dataType === "date") {
      newValues =
        key === "maxValue"
          ? [ToUTCString(minValue), ToUTCString(value)]
          : [ToUTCString(value), ToUTCString(maxValue)];
    } else {
      newValues =
        key === "maxValue"
          ? [minValue, Number(value)]
          : [Number(value), maxValue];
    }

    setData(newValues, filter.id, TYPE_RANGE);
  };

  if (filter.dataType === "date") {
    return (
      <QueryLimit
        isFilter
        dateType
        min={min}
        max={max}
        disabled={disabled}
        value={[UTCString(minValue), UTCString(maxValue)]}
        onChange={(value) => onSetData(value)}
        handleOnChangeValue={handleOnChangeValue}
      />
    );
  }

  return (
    <QueryLimit
      isFilter
      min={min}
      max={max}
      disabled={disabled}
      value={[minValue, maxValue]}
      onChange={(value) => onSetData(value)}
      handleOnChangeValue={handleOnChangeValue}
    />
  );
};

export default FilterRange;
