import React, { useState, useEffect } from "react";
import Slider from "components/slider";
import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import Input from "styles-common/input";
import styled from "styled-components";

import isFloat from "helpers/isFloat";

const StyledSliderBox = styled.div`
  width: 100%;
  display: flex;
  padding: 20px 0;
`;

const StyledInputBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${props => (props.isDouble ? "space-between" : "flex-end")};
  input {
    max-width: 100px;
  }
`;

const QueryLimit = ({
  label,
  min = null,
  max = null,
  value,
  minDistance = 1,
  onChange = data => {},
  handleOnChangeValue = (data, key) => {}
}) => {
  const isDouble = Array.isArray(value);
  const isFloatingPoint = isFloat(min) || isFloat(max);

  let minValue = min;
  let maxValue = max;
  if (isDouble) {
    minValue = value[0];
    maxValue = value[1];
  } else {
    maxValue = value ? value : max;
  }

  if (maxValue - minValue <= minDistance) {
    minValue = maxValue - minDistance;
  }

  const minMaxProps = {
    ...(min !== null && { min }),
    ...(max !== null && { max })
  };

  return (
    <FlexContainer>
      {label && <FormLabel htmlFor="options-limit">{label}</FormLabel>}
      <StyledSliderBox>
        <Slider
          {...minMaxProps}
          step={isFloatingPoint ? 0.1 : 1}
          value={isDouble ? [minValue, maxValue] : maxValue}
          defaultValue={isDouble ? min : [min, max]}
          onChange={value => onChange(value)}
        />
      </StyledSliderBox>
      <StyledInputBox isDouble={isDouble}>
        {isDouble && (
          <Input
            {...minMaxProps}
            value={minValue}
            type="number"
            name="options-limit"
            onChange={e => handleOnChangeValue(e.target.value, "minValue")}
          />
        )}
        <Input
          {...minMaxProps}
          value={maxValue}
          type="number"
          name="options-limit"
          onChange={e => handleOnChangeValue(e.target.value, "maxValue")}
        />
      </StyledInputBox>
    </FlexContainer>
  );
};

export default QueryLimit;
