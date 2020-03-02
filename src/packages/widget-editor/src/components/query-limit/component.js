import React, { useState, useEffect } from "react";
import Slider from "components/slider";
import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import Input from "styles-common/input";
import styled from "styled-components";

const StyledSliderBox = styled.div`
  width:100%;
  display: flex;
  padding: 20px 0;
`;

const StyledInputBox = styled.div`
  width:100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  input {
    max-width: 100px;
  }
`;

const QueryLimit = ({ 
  label = "Label", 
  min = 0, 
  max = 500,
  value,
  minDistance = 10,
  onChange = (data) => {},
  handleOnChangeValue = (data, key) => {} 
}) => {
  const isDouble = Array.isArray(value);
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
  
  const handleOnChange = value => {
    onChange(value);
  };

  return (
    <FlexContainer>
      <FormLabel htmlFor="options-limit">{label}</FormLabel>
      <StyledSliderBox>        
        <Slider
          min={min}
          max={max}
          value={[minValue, maxValue]}
          defaultValue={isDouble ? min : [min, max]}
          onChange={(value) => handleOnChange(value)}
        />
      </StyledSliderBox>
      <StyledInputBox>
        {isDouble && (
          <Input
            min={min}
            max={max}
            value={minValue}
            type="number"
            name="options-limit"
            onChange={e => handleOnChangeValue(e.target.value, 'minValue')}
          />
        )}
        <Input
          min={min}
          max={max}
          value={maxValue}
          type="number"
          name="options-limit"
          onChange={e => handleOnChangeValue(e.target.value, 'maxValue')}
        />
      </StyledInputBox>
    </FlexContainer>
  );
};

export default QueryLimit;
