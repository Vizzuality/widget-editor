// TODO: Rename this filter!
import React, { useState, useEffect } from "react";

import useDebounce from "hooks/use-debounce";

import Slider from "components/slider";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";

import styled from "styled-components";

const StyledSliderBox = styled.div`
  width: 100%;
  display: flex;
  padding: 20px 0;
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

const DonutRadius = ({
  min = 1,
  max = 150,
  value = 40,
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
  }, [onChange, handleOnChangeValue, debouncedValue]);

  let sliderValue = localValue.value ? localValue.value : max;

  const minMaxProps = {
    ...(min !== null && { min }),
    ...(max !== null && { max }),
  };

  return (
    <InputGroup>
      <FormLabel htmlFor="options-donut-radius">Donut radius</FormLabel>
      <StyledSliderBox>
        <Slider
          {...minMaxProps}
          step={1}
          defaultValue={sliderValue}
          value={sliderValue}
          onChange={(v) => setLocalValue({ value: v, key: null })}
        />
      </StyledSliderBox>
      <StyledInputBox isDouble={false}>
        <Input
          value={localValue.value}
          type="number"
          name="options-donut-radius"
          onChange={(e) =>
            setLocalValue({ value: e.target.value, key: "donut-radius" })
          }
        />
      </StyledInputBox>
    </InputGroup>
  );
};

export default DonutRadius;
