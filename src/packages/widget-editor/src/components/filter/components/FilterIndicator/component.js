import React from "react";
import Select from "react-select";

import { TYPE_INDICATOR } from "components/filter/const";

const FilterIndicator = ({
  filter,
  disabled = false,
  setData = () => {},
  optionData = []
}) => {
  const handleChange = options => {
    setData(options, filter.id, TYPE_INDICATOR);
  };

  return (
    <Select
      isDisabled={disabled}
      value={
        filter.indicator
          ? optionData.find(o => o.value === filter.indicator)
          : null
      }
      placeholder="Select Indicator"
      name={`filter-indicator-${filter.id}`}
      options={optionData}
      onChange={handleChange}
    />
  );
};
export default FilterIndicator;
