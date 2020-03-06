import React from 'react';
import Select from "react-select";

const FilterColumn = ({ filter, setData = () => {}, id, optionData = [] }) => {

  const { values } = filter;

  const handleChange = options => {
    setData(options, id);
  };

  return (
    <Select 
      value={values}
      name={`filter-column-${id}`}
      isMulti
      options={optionData}
      onChange={handleChange}
    />
  ); 
}
export default FilterColumn;