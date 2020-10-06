import React, { Fragment, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import debounce from 'lodash/debounce';

import FlexContainer from "styles-common/flex";
import FlexController from "styles-common/flex-controller";
import Slider from "components/slider";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";

import isFloat from "@widget-editor/shared/lib/helpers/isFloat";

const RangeWrapper = styled.div`
  padding: 10px 10px;
  box-sizing: border-box;
  .rc-slider-handle {
    margin-top: -7px;
  }
`;

const QueryLimit = ({
  label,
  dateType = false,
  isFilter = false,
  min = null,
  max = null,
  value,
  onChange = () => null,
}) => {
  const [localValue, setLocalValue] = useState(value);

  const isDouble = Array.isArray(localValue);
  const isFloatingPoint = isFloat(min) || isFloat(max);

  let minValue = min;
  let maxValue = max;
  if (isDouble) {
    minValue = localValue[0];
    maxValue = localValue[1];
  } else {
    maxValue = localValue ?? max;
  }

  const minMaxProps = {
    ...(min !== null && { min }),
    ...(max !== null && { max }),
  };

  const sliderValue = useMemo(
    () => isDouble ? [minValue, maxValue] : maxValue,
    [isDouble, minValue, maxValue]
  );

  const onChangeDebounced = useCallback(debounce(onChange, 300), [onChange]);

  const onChangeValue = useCallback((value) => {
    setLocalValue(value);
    onChangeDebounced(value);
  }, [setLocalValue, onChangeDebounced]);

  return (
    <InputGroup>
      {label && <FormLabel htmlFor="options-limit-max">{label}</FormLabel>}

      {!isFilter && (
        <FlexContainer row={true}>
          <FlexController contain={20}>
            <Input
              {...minMaxProps}
              step={isFloatingPoint ? 0.1 : 1}
              value={maxValue}
              type={dateType ? "date" : "number"}
              name="options-limit-max"
              onChange={e => onChangeValue(isDouble ? [min, +e.target.value] : +e.target.value)}
            />
          </FlexController>
          <FlexController contain={80}>
            <Slider
              {...minMaxProps}
              step={isFloatingPoint ? 0.1 : 1}
              value={sliderValue}
              defaultValue={isDouble ? [min, max] : max}
              onChange={onChangeValue}
            />
          </FlexController>
        </FlexContainer>
      )}

      {isFilter && (
        <Fragment>
          <FlexContainer row={true}>
            <FlexController contain={100}>
              <RangeWrapper>
                <Slider
                  {...minMaxProps}
                  step={isFloatingPoint ? 0.1 : 1}
                  value={sliderValue}
                  defaultValue={isDouble ? [min, max] : max}
                  onChange={onChangeValue}
                />
              </RangeWrapper>
            </FlexController>
          </FlexContainer>
          <FlexContainer row={true}>
            <FlexController contain={50} constrainElement={40}>
              {isDouble && (
                <Input
                  {...minMaxProps}
                  step={isFloatingPoint ? 0.1 : 1}
                  value={minValue}
                  type={dateType ? "date" : "number"}
                  name="options-limit-min"
                  onChange={e => onChangeValue([+e.target.value, maxValue])}
                />
            )}
            </FlexController>
            <FlexController
              contain={50}
              constrainElement={40}
              alignment="right"
            >
              <Input
                {...minMaxProps}
                step={isFloatingPoint ? 0.1 : 1}
                value={maxValue}
                type={dateType ? "date" : "number"}
                name="options-limit-max"
                onChange={e =>
                  onChangeValue(isDouble ? [minValue, +e.target.value] : +e.target.value)
                }
              />
            </FlexController>
          </FlexContainer>
        </Fragment>
      )}
    </InputGroup>
  );
};

export default QueryLimit;
