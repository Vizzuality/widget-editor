import React from 'react';
import Input from 'styles-common/input';
import styled from 'styled-components';

const StyledInput = styled(Input)`
  text-align: left !important;
`;

const FilterValue = ({ filter, setData, id }) => {

  const { values, min, max } = filter;

  return (
    <StyledInput
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