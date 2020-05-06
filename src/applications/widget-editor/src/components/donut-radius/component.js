// TODO: Rename this filter!
import React, { useState, useEffect } from "react";

import useDebounce from "hooks/use-debounce";

import FlexContainer from "styles-common/flex";
import FlexController from "styles-common/flex-controller";

import Slider from "components/slider";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";

const DonutRadius = ({
  min = 1,
  max = 150,
  value = 40,
  minDistance = 1,
  onChange = (data) => {},
}) => {
  const [localValue, setLocalValue] = useState({ value, key: null });
  const debouncedValue = useDebounce(localValue, 400);

  useEffect(() => {
    if (!debouncedValue.key) {
      onChange(debouncedValue.value);
    } else {
      onChange(debouncedValue.value, debouncedValue.key);
    }
  }, [debouncedValue]);

  return (
    <InputGroup>
      <FormLabel htmlFor="options-donut-radius">Donut radius</FormLabel>
      <FlexContainer row={true}>
        <FlexController contain={20}>
          <Input
            value={localValue.value}
            type="number"
            name="options-donut-radius"
            onChange={(e) =>
              setLocalValue({ value: e.target.value, key: "donut-radius" })
            }
          />
        </FlexController>
        <FlexController contain={80}>
          <Slider
            min={min}
            max={max}
            value={localValue.value}
            onChange={(v) => setLocalValue({ value: v, key: null })}
          />
        </FlexController>
      </FlexContainer>
    </InputGroup>
  );
};

export default DonutRadius;
