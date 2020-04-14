function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// TODO: Rename this filter!
import React, { useState, useEffect } from "react";
import useDebounce from "../../hooks/use-debounce";
import Slider from "../slider";
import FlexContainer from "../../styles-common/flex";
import FormLabel from "../../styles-common/form-label";
import InputGroup from "../../styles-common/input-group";
import Input from "../../styles-common/input";
import styled from "styled-components";
import isFloat from "@packages/shared/lib/helpers/isFloat";
const StyledSliderBox = styled.div.withConfig({
  displayName: "component__StyledSliderBox",
  componentId: "sc-1sht6zq-0"
})(["width:100%;display:flex;padding:20px 0;"]);
const StyledInputBox = styled.div.withConfig({
  displayName: "component__StyledInputBox",
  componentId: "sc-1sht6zq-1"
})(["width:100%;display:flex;align-items:center;justify-content:", ";input{max-width:100px;}"], props => props.isDouble ? "space-between" : "flex-end");

const QueryLimit = ({
  label,
  min = null,
  max = null,
  value,
  minDistance = 1,
  onChange = data => {},
  handleOnChangeValue = (data, key) => {}
}) => {
  const [localValue, setLocalValue] = useState({
    value,
    key: null
  });
  const debouncedValue = useDebounce(localValue, 400);
  useEffect(() => {
    if (!debouncedValue.key) {
      onChange(debouncedValue.value);
    } else {
      handleOnChangeValue(debouncedValue.value, debouncedValue.key);
    }
  }, [debouncedValue]);
  const isDouble = Array.isArray(localValue.value);
  const isFloatingPoint = isFloat(min) || isFloat(max);
  let minValue = min;
  let maxValue = max;

  if (isDouble) {
    minValue = localValue.value[0];
    maxValue = localValue.value[1];
  } else {
    maxValue = localValue.value ? localValue.value : max;
  }

  if (maxValue - minValue <= minDistance) {
    minValue = maxValue - minDistance;
  }

  const minMaxProps = { ...(min !== null && {
      min
    }),
    ...(max !== null && {
      max
    })
  };
  return React.createElement(InputGroup, null, label && React.createElement(FormLabel, {
    htmlFor: "options-limit"
  }, label), React.createElement(StyledSliderBox, null, React.createElement(Slider, _extends({}, minMaxProps, {
    step: isFloatingPoint ? 0.1 : 1,
    value: isDouble ? [minValue, maxValue] : maxValue,
    defaultValue: isDouble ? min : [min, max],
    onChange: value => setLocalValue({
      value,
      key: null
    })
  }))), React.createElement(StyledInputBox, {
    isDouble: isDouble
  }, isDouble && React.createElement(Input, _extends({}, minMaxProps, {
    value: minValue,
    type: "number",
    name: "options-limit",
    onChange: e => setLocalValue({
      value: e.target.value,
      key: "minValue"
    })
  })), React.createElement(Input, _extends({}, minMaxProps, {
    value: maxValue,
    type: "number",
    name: "options-limit",
    onChange: e => setLocalValue({
      value: e.target.value,
      key: "maxValue"
    })
  }))));
};

export default QueryLimit;