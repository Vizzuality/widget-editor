import React from "react";
import Input from "../../../../styles-common/input";
import styled from "styled-components";
import isFloat from "@packages/shared/lib/helpers/isFloat";
import { TYPE_VALUE } from "../../const";
const StyledInput = styled(Input).withConfig({
  displayName: "component__StyledInput",
  componentId: "sc-14w24ra-0"
})(["text-align:left !important;"]);

const FilterValue = ({
  filter,
  disabled = false,
  setData,
  isNumeric = true
}) => {
  const {
    values
  } = filter.filter;
  const {
    min,
    max
  } = filter.fieldInfo ? filter.fieldInfo : {
    min: 0,
    max: 100
  };
  const isFloatingPoint = isFloat(min) || isFloat(max);
  return React.createElement(StyledInput, {
    min: min,
    max: max,
    step: isFloatingPoint ? 0.1 : 1,
    disabled: disabled,
    value: values,
    type: isNumeric ? "number" : "text",
    name: `filter-value-${filter.id}`,
    onChange: e => setData(e.target.value, filter.id, TYPE_VALUE)
  });
};

export default FilterValue;