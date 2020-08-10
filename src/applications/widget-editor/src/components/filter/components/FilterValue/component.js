import React, { useState, useCallback } from "react";
import debounce from 'lodash/debounce';
import styled from "styled-components";
import PropTypes from 'prop-types';

import Input from "styles-common/input";

import isFloat from "@widget-editor/shared/lib/helpers/isFloat";

const StyledInput = styled(Input)`
  text-align: left !important;
`;

const getInputValue = (type, value) => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (type === 'number') {
    return +value;
  }
  
  if (type === 'date') {
    return new Date(value).toISOString().split('T')[0];
  }
  
  return value;
};

const FilterValue = ({ filter, onChange, ...rest }) => {
  const [value, setValue] = useState(getInputValue(filter.type, filter.value));

  const isFloatingPoint = filter.type === 'number'
    && (isFloat(filter.config.min) || isFloat(filter.config.max));

  const onChangeDebounced = useCallback(debounce(onChange, 500), [onChange]);

  const onChangeValue = useCallback(({ target }) => {
    let newValue = target.value;
    if (filter.type === 'number') {
      newValue = +target.value;
    } else if (filter.type === 'date') {
      newValue = new Date(target.value);
    }

    setValue(getInputValue(filter.type, newValue));
    onChangeDebounced(newValue);
  }, [filter, onChangeDebounced]);

  return (
    <StyledInput
      type={filter.type === 'string' ? 'text' : filter.type}
      name={`filter-value-${filter.id}`}
      {...(filter.type === 'number'
        ? {
          step: isFloatingPoint ? 0.1 : 1,
          min: Math.floor(filter.config.min),
          max: Math.ceil(filter.config.max),
        }
        : {}
      )}
      {...(filter.type === 'date'
        ? {
          min: getInputValue('date', filter.config.min),
          max: getInputValue('date', filter.config.max),
        }
        : {}
      )}
      value={value}
      onChange={onChangeValue}
      {...rest}
    />
  );
};

FilterValue.propTypes = {
  filter: PropTypes.shape({
    column: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    operation: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.any, PropTypes.arrayOf(PropTypes.any)]),
    config: PropTypes.object.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterValue;
