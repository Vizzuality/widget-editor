import React from "react";
import QueryLimit from "components/query-limit";

import { TYPE_RANGE } from "components/filter/const";

// TODO: Move to utils
const yearToUTC = y => new Date(Date.UTC(y)).toISOString();
const UTCToYear = utcString => new Date(utcString).getFullYear();

const FilterRange = ({ filter, disabled = false, setData }) => {
  const { values } = filter.filter;
  const { min, max } = filter.fieldInfo
    ? filter.fieldInfo
    : { min: 0, max: 100 };
  const [minValue, maxValue] = values;

  const onSetData = values => {
    let serializeValues;
    if (filter.dataType === "date") {
      serializeValues = [yearToUTC(values[0]), yearToUTC(values[1])];
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
          ? [yearToUTC(minValue), yearToUTC(Number(value))]
          : [yearToUTC(Number(value)), yearToUTC(maxValue)];
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
        min={UTCToYear(min)}
        max={UTCToYear(max)}
        disabled={disabled}
        value={[UTCToYear(minValue), UTCToYear(maxValue)]}
        onChange={value => onSetData(value)}
        handleOnChangeValue={handleOnChangeValue}
      />
    );
  }

  return (
    <QueryLimit
      min={min}
      max={max}
      disabled={disabled}
      value={[minValue, maxValue]}
      onChange={value => onSetData(value)}
      handleOnChangeValue={handleOnChangeValue}
    />
  );
};

export default FilterRange;
