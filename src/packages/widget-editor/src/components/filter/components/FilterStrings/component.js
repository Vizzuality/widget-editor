import React from "react";
import Select from "react-select";

import { TYPE_FILTER_ON_VALUES } from "components/filter/const";

const FilterStrings = ({
  filter,
  disabled = false,
  setData = () => {},
  optionData = []
}) => {
  const value = filter.filter.values;
  const handleChange = options => {
    setData(options, filter.id, TYPE_FILTER_ON_VALUES);
  };

  return (
    <Select
      isDisabled={disabled}
      value={value ? value : null}
      isMulti
      placeholder={`Select ${filter.column}`}
      name={`filter-string-values-${filter.id}`}
      options={optionData}
      onChange={handleChange}
    />
  );
};

export default FilterStrings;
