import React, { useMemo } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";

import { Select } from "@widget-editor/shared";

const Wrapper = styled.div`
  margin-top: 15px;
`;

const FilterStrings = ({ filter, onChange, ...rest }) => {
  const options = useMemo(
    () => filter.config.values.map(value => ({
      label: value === '' ? '(empty string)' : value,
      value
    })),
    [filter]
  );

  return (
    <Wrapper>
      <Select
        isMulti
        id={`filter-string-values-${filter.id}`}
        name={`filter-string-values-${filter.id}`}
        aria-label="Select values"
        placeholder="Select values"
        value={(filter.value ?? []).map(value => options.find(option => option.value === value))}
        options={options}
        onChange={selectedOptions => onChange(
          selectedOptions === null ? [] : selectedOptions.map(({ value }) => value)
        )}
        {...rest}
      />
    </Wrapper>
  );
};

FilterStrings.propTypes = {
  filter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    column: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    operation: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    config: PropTypes.object.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterStrings;
