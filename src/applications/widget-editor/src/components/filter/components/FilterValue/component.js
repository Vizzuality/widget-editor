import React from "react";
import Input from "styles-common/input";
import styled from "styled-components";

import isFloat from "@widget-editor/shared/lib/helpers/isFloat";

import { TYPE_VALUE } from "components/filter/const";

const StyledInput = styled(Input)`
  text-align: left !important;
`;

const FilterValue = ({
  filter,
  disabled = false,
  setData,
  isNumeric = true,
}) => {
  const { values } = filter.filter;
  const { min, max } = filter.fieldInfo
    ? filter.fieldInfo
    : { min: 0, max: 100 };

  const isFloatingPoint = isFloat(min) || isFloat(max);

  return (
    <StyledInput
      min={min}
      max={max}
      step={isFloatingPoint ? 0.1 : 1}
      disabled={disabled}
      value={values}
      type={isNumeric ? "number" : "text"}
      name={`filter-value-${filter.id}`}
      onChange={(e) => setData(e.target.value, filter.id, TYPE_VALUE)}
    />
  );
};

export default FilterValue;
