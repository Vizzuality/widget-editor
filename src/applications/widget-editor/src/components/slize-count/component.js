import React, { useState, useEffect } from "react";

import useDebounce from "hooks/use-debounce";

import FlexContainer from "styles-common/flex";
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
  flex: 120px;
  margin: 0 0 0 30px;
`;

// TODO: Move me
const getGroupedCount = (data) => {
  const out = {};

  data.forEach((entry) => {
    if (out.hasOwnProperty(entry.x)) {
      out[entry.x] = out[entry.x] + 1;
    } else {
      out[entry.x] = 1;
    }
  });

  return Object.values(out).length;
};

const SlizeCount = ({
  min = 1,
  value = 40,
  data = null,
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
      <FormLabel htmlFor="options-donut-radius">
        Slize count (donut and pie charts)
      </FormLabel>
      <FlexContainer row={true}>
        <StyledSliderBox>
          <Slider
            min={min}
            max={data ? getGroupedCount(data) : 10}
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
              setLocalValue({ value: e.target.value, key: "slize-count" })
            }
          />
        </StyledInputBox>
      </FlexContainer>
    </InputGroup>
  );
};

export default SlizeCount;
