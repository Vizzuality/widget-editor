import React, { useMemo } from "react";
import PropTypes from 'prop-types';
import Select from "react-select";
import styled from "styled-components";

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
        placeholder="Select values"
        name={`filter-string-values-${filter.id}`}
        value={(filter.value ?? []).map(value => options.find(option => option.value === value))}
        options={options}
        onChange={selectedOptions => onChange(selectedOptions.map(({ value }) => value))}
        {...rest}
      />
    </Wrapper>
  );
};

FilterStrings.propTypes = {
  filter: PropTypes.shape({
    column: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    operation: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    config: PropTypes.object.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterStrings;
