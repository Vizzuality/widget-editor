import React from 'react';
import PropTypes from 'prop-types';

import { Select } from "@widget-editor/shared";

import InputGroup from "styles-common/input-group";
import { FILTER_STRING_OPERATIONS } from '../../const';
import FilterValue from '../FilterValue';
import FilterStrings from '../FilterStrings';

const StringFilter = ({ filter, onChange }) => {
  const displaySelect = filter.operation === 'by-values';

  return (
    <>
      <InputGroup noMargins={displaySelect}>
        <Select
          id={`filter-string-operation-${filter.id}`}
          name={`filter-string-operation-${filter.id}`}
          aria-label="Select an operation"
          placeholder="Select an operation"
          value={FILTER_STRING_OPERATIONS.find(op => op.value === filter.operation)}
          options={FILTER_STRING_OPERATIONS}
          onChange={({ value }) => onChange({ operation: value, value: null })}
        />
      </InputGroup>

      {!!filter.operation && (
        <InputGroup>
          {displaySelect && (
            <FilterStrings
              filter={filter}
              onChange={value => onChange({ value })}
            />
          )}

          {!displaySelect && (
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

StringFilter.propTypes = {
  filter: PropTypes.shape({
    column: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    operation: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    config: PropTypes.object.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default StringFilter;