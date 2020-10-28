import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';

import useDebounce from "hooks/use-debounce";

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

  const onChangeDebounced = useDebounce(onChange);

  const onChangeValue = useCallback((value) => {
    let newValue = value;
    if (filter.type === 'number') {
      newValue = +value;
    } else if (filter.type === 'date') {
      newValue = new Date(value);
    }

    setValue(getInputValue(filter.type, newValue));
    onChangeDebounced(newValue);
  }, [filter, onChangeDebounced]);

  // When the filter changes, we make sure to update the UI as well
  // This case occurs when the user changes the filter's operation: the value is set to null so we
  // need to make sure the input is also empty
  useEffect(() => {
    setValue(getInputValue(filter.type, filter.value));
  }, [filter, setValue]);

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
      value={`${value}`}
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
