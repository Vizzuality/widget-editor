// TODO: Rename this filter!
import React, { useState, useEffect } from "react";

import useDebounce from "hooks/use-debounce";

import Slider from "components/slider";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";
import styled from "styled-components";

import isFloat from "@widget-editor/shared/lib/helpers/isFloat";

const StyledSliderBox = styled.div`
  width: calc(100% - 15px);
  display: flex;
  padding: 20px 0;
  margin: 0 5px;
`;

const StyledInputBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.isDouble ? "space-between" : "flex-end"};
  input {
    max-width: 100px;
  }
`;

const QueryLimit = ({
  label,
  dateType=false,
  min = null,
  max = null,
  value,
  minDistance = 1,
  onChange = (data) => {},
  handleOnChangeValue = (data, key) => {},
}) => {
  const [localValue, setLocalValue] = useState({ value, key: null });
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

  const minMaxProps = {
    ...(min !== null && { min }),
    ...(max !== null && { max }),
  };

  return (
    <InputGroup>
      {label && <FormLabel htmlFor="options-limit-max">{label}</FormLabel>}
      {!dateType && <StyledSliderBox>
        <Slider
          {...minMaxProps}
          step={isFloatingPoint ? 0.1 : 1}
          value={isDouble ? [minValue, maxValue] : maxValue}
          defaultValue={isDouble ? min : [min, max]}
          onChange={(value) => setLocalValue({ value, key: null })}
        />
      </StyledSliderBox>}
      <StyledInputBox isDouble={isDouble}>
        {isDouble && (
          <Input
            {...minMaxProps}
            value={minValue}
            type={dateType ? 'date' : 'number'}
            name="options-limit-min"
            onChange={(e) =>
              setLocalValue({ value: e.target.value, key: "minValue" })
            }
          />
        )}
        <Input
          {...minMaxProps}
          value={maxValue}
          type={dateType ? 'date' : 'number'}
          name="options-limit-max"
          onChange={(e) =>
            setLocalValue({ value: e.target.value, key: "maxValue" })
          }
        />
      </StyledInputBox>
    </InputGroup>
  );
};

export default QueryLimit;
