import React, { Fragment, useState, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";

import useDebounce from "hooks/use-debounce";

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

  const onChangeDebounced = useDebounce(onChange);

  const onChangeValue = useCallback((value) => {
    setLocalValue(value);
    onChangeDebounced(value);
  }, [setLocalValue, onChangeDebounced]);

  return (
    <InputGroup>
      {label && <FormLabel htmlFor="options-limit-max">{label}</FormLabel>}

      {!isFilter && (
        <FlexContainer row={true}>
          <FlexController shrink="0">
            <Input
              {...minMaxProps}
              step={isFloatingPoint ? 0.1 : 1}
              value={`${maxValue}`}
              type={dateType ? "date" : "number"}
              id="options-limit-max"
              name="options-limit-max"
              size="4"
              onChange={value => onChangeValue(isDouble ? [min, +value] : +value)}
            />
          </FlexController>
          <FlexController  grow="1">
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
            <FlexController contain={100} constrainElement={100}>
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
            <FlexController>
              {isDouble && (
                <Input
                  {...minMaxProps}
                  step={isFloatingPoint ? 0.1 : 1}
                  value={`${minValue}`}
                  type={dateType ? "date" : "number"}
                  name="options-limit-min"
                  id="options-limit-min"
                  size={dateType ? undefined : `${Math.max(minMaxProps.min, minMaxProps.max)}`.length + 1}
                  onChange={value => onChangeValue([+value, maxValue])}
                />
            )}
            </FlexController>
            <FlexController alignment="right">
              <Input
                {...minMaxProps}
                step={isFloatingPoint ? 0.1 : 1}
                value={`${maxValue}`}
                type={dateType ? "date" : "number"}
                name="options-limit-max"
                id="options-limit-max"
                size={dateType ? undefined : `${Math.max(minMaxProps.min, minMaxProps.max)}`.length + 1}
                onChange={value => onChangeValue(isDouble ? [minValue, +value] : +value)}
              />
            </FlexController>
          </FlexContainer>
        </Fragment>
      )}
    </InputGroup>
  );
};

QueryLimit.propTypes = {
  label: PropTypes.string,
  dateType: PropTypes.bool,
  isFilter: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func
}

export default QueryLimit;
