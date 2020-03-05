import React from 'react';
import QueryLimit from "components/query-limit";

const FilterRange = ({ filter, setData, id }) => {

  const { values } = filter;
  const [minValue, maxValue] = values;

  const onSetData = (values) => {
    setData(values, id);
  }

  const handleOnChangeValue = (value, key = 'maxValue') => {
    const newValues = key === 'maxValue' ? [minValue, Number(value)] : [Number(value), maxValue];
    setData(newValues, id);
  }
  

  return (
    <QueryLimit 
      max={100}
      label="Limit"
      value={[minValue, maxValue]}
      onChange={(value) => onSetData(value)}
      handleOnChangeValue={handleOnChangeValue}
    />
  ); 
}

export default FilterRange;