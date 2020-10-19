// TODO: Rename this filter!
import React, { useState } from "react";

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

  const changeValue = (data) => {
    setLocalValue(data);
    debounceOnChange(data);
  }

  const debounceOnChange = useDebounce(q => {
    onChange(q.value, q.key);
  });


  return (
    <InputGroup>
      <FormLabel htmlFor="options-donut-radius">Donut radius</FormLabel>
      <FlexContainer row={true}>
        <FlexController contain={20}>
          <Input
            value={`${localValue.value}`}
            type="number"
            id="options-donut-radius"
            name="options-donut-radius"
            onChange={value => changeValue({ value, key: "donut-radius" })}
          />
        </FlexController>
        <FlexController contain={80}>
          <Slider
            min={min}
            max={max}
            value={localValue.value}
            onChange={(v) => changeValue({ value: v, key: null })}
          />
        </FlexController>
      </FlexContainer>
    </InputGroup>
  );
};

export default DonutRadius;
