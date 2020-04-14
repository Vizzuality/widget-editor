import React from "react";
import Select from "react-select";

import { TYPE_INDICATOR } from "components/filter/const";

const FilterIndicator = ({
  filter,
  disabled = false,
  setData = () => {},
  optionData = []
}) => {
  const value =
    filter.indicator === "string"
      ? filter.filter.values
      : optionData.find(o => o.value === filter.indicator);

  const handleChange = options => {
    setData(options, filter.id, TYPE_INDICATOR);
  };

  return (
    <Select
      isDisabled={disabled}
      value={value ? value : null}
      isMulti={filter.indicator === "string"}
      placeholder={
        filter.indicator === "string"
          ? `Select ${filter.column}`
          : "Select Indicator"
      }
      name={`filter-indicator-${filter.id}`}
      options={optionData}
      onChange={handleChange}
    />
  );
};
export default FilterIndicator;
