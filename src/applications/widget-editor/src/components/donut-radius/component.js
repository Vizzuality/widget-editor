// TODO: Rename this filter!
import React, { useState, useEffect } from "react";

import useDebounce from "hooks/use-debounce";

import FlexContainer from "styles-common/flex";
import Slider from "components/slider";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";

import styled from "styled-components";

const StyledSliderBox = styled.div`
  width: calc(100% - 15px);
  display: flex;
  padding: 20px 0;
  margin: 0 5px;
`;

const StyledInputBox = styled.div`
  flex: 120px;
  margin: 0 0 0 30px;
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

  return (
    <InputGroup>
      <FormLabel htmlFor="options-donut-radius">Donut radius</FormLabel>
      <FlexContainer row={true}>
        <StyledSliderBox>
          <Slider
            min={min}
            max={max}
            value={localValue.value}
            onChange={(v) => setLocalValue({ value: v, key: null })}
          />
        </StyledSliderBox>
        <StyledInputBox>
          <Input
            value={localValue.value}
            type="number"
            name="options-donut-radius"
            onChange={(e) =>
              setLocalValue({ value: e.target.value, key: "donut-radius" })
            }
          />
        </StyledInputBox>
      </FlexContainer>
    </InputGroup>
  );
};

export default DonutRadius;
