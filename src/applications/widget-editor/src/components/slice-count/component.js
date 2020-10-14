import React, { useState } from "react";

import useDebounce from "hooks/use-debounce";

import FlexContainer from "styles-common/flex";
import FlexController from "styles-common/flex-controller";
import Slider from "components/slider";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";
import { StyledNote } from './style';

const SliceCount = ({
  min = 1,
  value = null,
  data = null,
  minDistance = 1,
  onChange = (data) => {},
  disabledFeatures,
}) => {
  const [localValue, setLocalValue] = useState({ value: value, key: null });

  const changeValue = (data) => {
    if (data.value !== 0) {
      setLocalValue(data);
      debounceOnChange(data);
    }
  }

  const debounceOnChange = useDebounce(q => {
    onChange(q.value, q.key);
  });

  return (
    <InputGroup>
      <FormLabel htmlFor="options-slice-count">
        Slice count (donut and pie charts)
      </FormLabel>
      <FlexContainer row={true}>
        <FlexController contain={20}>
          <Input
            value={localValue.value}
            type="number"
            id="options-slice-count"
            name="options-slice-count"
            onChange={(e) =>
              changeValue({ value: e.target.value, key: "slice-count" })
            }
          />
        </FlexController>
        <FlexController contain={80}>
          <Slider
            min={min}
            max={10} // TODO: Can we be dynamic with this?
            value={localValue.value}
            onChange={(v) => changeValue({ value: v, key: null })}
          />
        </FlexController>
      </FlexContainer>
      {disabledFeatures.indexOf("end-user-filters") === -1 && (
        <StyledNote>
          This setting is ignored when end-user filters are defined.
        </StyledNote>
      )}
    </InputGroup>
  );
};

export default SliceCount;
