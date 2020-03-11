import React from "react";
import Select from "react-select";

import { TYPE_INDICATOR } from "components/filter/const";

const FilterIndicator = ({
  filter,
  disabled = false,
  setData = () => {},
  optionData = []
}) => {
  const options =
    filter.indicator === "list" && filter && Array.isArray(filter.fieldInfo)
      ? filter.fieldInfo.map(f => ({ label: f, value: f }))
      : optionData;

  const value =
    filter.indicator === "list"
      ? filter.filter.values
      : options.find(o => o.value === filter.indicator);

  const handleChange = options => {
    setData(options, filter.id, TYPE_INDICATOR);
  };

  return (
    <Select
      isDisabled={disabled}
      value={value ? value : null}
      isMulti={filter.indicator === "list"}
      placeholder={
        filter.indicator === "list"
          ? `Select ${filter.column}`
          : "Select Indicator"
      }
      name={`filter-indicator-${filter.id}`}
      options={options}
      onChange={handleChange}
    />
  );
};
export default FilterIndicator;
