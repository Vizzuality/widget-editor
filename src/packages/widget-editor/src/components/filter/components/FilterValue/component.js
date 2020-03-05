import React from 'react';
import Input from "styles-common/input";

const FilterValue = ({ filter, setData, id }) => {

  const { values, min, max } = filter;

  return (
    <Input
      min={min}
      max={max}
      value={values}
      type="number"
      name={`filter-value-${id}`}
      onChange={e => setData(e.target.value, id)}
    />
  ); 
}

export default FilterValue;