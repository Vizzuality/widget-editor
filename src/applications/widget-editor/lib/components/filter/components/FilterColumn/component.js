import React from "react";
import Select from "react-select";
import { TYPE_COLUMNS } from "../../const";

const FilterColumn = ({
  filter,
  setData = () => {},
  optionData = []
}) => {
  const handleChange = options => {
    setData(options, filter.id, TYPE_COLUMNS);
  };

  const value = optionData.find(({
    value
  }) => value === filter.column);
  return React.createElement(Select, {
    value: value,
    placeholder: "Select Column",
    name: `filter-column-${filter.id}`,
    options: optionData,
    onChange: handleChange
  });
};

export default FilterColumn;