import React, { useState } from "react";
import PropTypes from 'prop-types';
import useDebounce from "hooks/use-debounce";

import FlexContainer from "styles-common/flex";
import FlexController from "styles-common/flex-controller";
import Slider from "components/slider";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";
import InputInfo from "styles-common/input-info";

const SliceCount = ({
  min = 1,
  value = null,
  onChange = () => {},
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
        Slice count
      </FormLabel>
      <FlexContainer row={true}>
        <FlexController shrink="0">
          <Input
            value={`${localValue.value}`}
            type="number"
            id="options-slice-count"
            name="options-slice-count"
            onChange={value => changeValue({ value, key: "slice-count" })}
            aria-describedby="options-slice-count-info"
            size="3"
          />
        </FlexController>
        <FlexController grow="1">
          <Slider
            min={min}
            max={10}
            value={localValue.value}
            onChange={(v) => changeValue({ value: v, key: null })}
          />
        </FlexController>
      </FlexContainer>
      {disabledFeatures.indexOf("end-user-filters") === -1 && (
        <InputInfo id="options-slice-count-info">
          This setting is ignored when end-user filters are defined.
        </InputInfo>
      )}
    </InputGroup>
  );
};

SliceCount.propTypes = {
  min: PropTypes.number,
  value: PropTypes.number,
  data: PropTypes.any,
  minDistance: PropTypes.number,
  onChange: PropTypes.func,
  disabledFeatures: PropTypes.arrayOf(PropTypes.string)
}

export default SliceCount;
