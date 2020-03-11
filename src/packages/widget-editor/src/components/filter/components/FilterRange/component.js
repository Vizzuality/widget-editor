import React from "react";
import QueryLimit from "components/query-limit";

import { TYPE_RANGE } from "components/filter/const";

const FilterRange = ({ filter, disabled = false, setData }) => {
  const { values } = filter.filter;
  const { min, max } = filter.fieldInfo
    ? filter.fieldInfo
    : { min: 0, max: 100 };
  const [minValue, maxValue] = values;

  const onSetData = values => {
    setData(values, filter.id, TYPE_RANGE);
  };

  const handleOnChangeValue = (value, key = "maxValue") => {
    const newValues =
      key === "maxValue"
        ? [minValue, Number(value)]
        : [Number(value), maxValue];
    setData(newValues, id);
  };

  return (
    <QueryLimit
      max={max}
      min={min}
      disabled={disabled}
      value={[minValue, maxValue]}
      onChange={value => onSetData(value)}
      handleOnChangeValue={handleOnChangeValue}
    />
  );
};

export default FilterRange;
