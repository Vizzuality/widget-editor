import React from 'react';
import PropTypes from 'prop-types';

import { Select } from "@widget-editor/shared";

import InputGroup from "styles-common/input-group";
import { FILTER_NUMBER_OPERATIONS } from '../../const';
import FilterValue from '../FilterValue';
import FilterRange from '../FilterRange';

const NumberFilter = ({ filter, onChange }) => {
  const displayRange = filter.operation === 'between' || filter.operation === 'not-between';

  return (
    <>
      <InputGroup noMargins={displayRange}>
        <Select
          id={`filter-number-operation-${filter.id}`}
          name={`filter-number-operation-${filter.id}`}
          aria-label="Select an operation"
          placeholder="Select an operation"
          value={FILTER_NUMBER_OPERATIONS.find(op => op.value === filter.operation)}
          options={FILTER_NUMBER_OPERATIONS}
          onChange={({ value }) => onChange({ operation: value, value: null })}
        />
      </InputGroup>

      {!!filter.operation && (
        <InputGroup>
          {displayRange && (
            <FilterRange
              // The key let us reinitiate the slider when the operation is changed
              key={filter.operation}
              filter={filter}
              onChange={value => onChange({ value })}
            />
          )}

          {!displayRange && (
            <FilterValue
              filter={filter}
              onChange={value => onChange({ value })}
            />
          )}
        </InputGroup>
      )}
    </>
  );
};

NumberFilter.propTypes = {
  filter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    column: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    operation: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    config: PropTypes.object.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default NumberFilter;