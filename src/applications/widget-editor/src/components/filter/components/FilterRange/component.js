import React from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";

import FlexContainer from "styles-common/flex";
import InputGroup from "styles-common/input-group";
import FormLabel from "styles-common/form-label";
import QueryLimit from "components/query-limit";
import FilterValue from '../FilterValue';

const DateRangeWrapper = styled.div`
  margin-top: 15px;
`;

const FilterRange = ({ filter, onChange, ...rest }) => {
  const { min, max } = filter.config;

  const [minValue, maxValue] = Array.isArray(filter.value)
    ? filter.value
    : [
      filter.type === 'number' ? Math.floor(min) : new Date(min).toISOString().split('T')[0],
      filter.type === 'number' ? Math.ceil(max) : new Date(max).toISOString().split('T')[0],
    ];

  if (filter.type === 'date') {
    return (
      <DateRangeWrapper>
        <FlexContainer row={true}>
          <InputGroup noMargins>
            <FormLabel htmlFor={`filter-range-${filter.id}-from`}>From</FormLabel>
            <FilterValue
              id={`filter-range-${filter.id}-from`}
              filter={{
                ...filter,
                value: minValue,
                config: { ...filter.config, max: +new Date(maxValue) }
              }}
              onChange={value => onChange([new Date(value), new Date(maxValue)])}
            />
          </InputGroup>
          <InputGroup noMargins>
            <FormLabel htmlFor={`filter-range-${filter.id}-to`}>To</FormLabel>
            <FilterValue
              id={`filter-range-${filter.id}-to`}
              filter={{
                ...filter,
                value: maxValue,
                config: { ...filter.config, min: +new Date(minValue) }
              }}
              onChange={value => onChange([new Date(minValue), new Date(value)])}
            />
          </InputGroup>
        </FlexContainer>
      </DateRangeWrapper>
    );
  }

  return (
    <QueryLimit
      isFilter
      min={Math.floor(min)}
      max={Math.ceil(max)}
      value={[minValue, maxValue]}
      onChange={onChange}
      {...rest}
    />
  );
};

FilterRange.propTypes = {
  filter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    column: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    operation: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.any, PropTypes.arrayOf(PropTypes.any)]),
    config: PropTypes.object.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterRange;
