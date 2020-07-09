import React, { Fragment, useState } from "react";
import debounce from 'lodash/debounce';

import styled from "styled-components";

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
  minDistance = 1,
  onChange = (data) => {},
}) => {
  const [localValue, setLocalValue] = useState({ value: value, key: null });

  const changeValue = (data) => {
    if (data.value !== 0) {
      setLocalValue(data);
      debounceOnChange(data);
    }
  }

  const debounceOnChange = debounce(q => {
    onChange(q.value, q.key);
  }, 1000);

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

      {!isFilter && (
        <FlexContainer row={true}>
          <FlexController contain={20}>
            <Input
              {...minMaxProps}
              value={maxValue}
              type={dateType ? "date" : "number"}
              name="options-limit-max"
              onChange={(e) =>
                changeValue({ value: e.target.value, key: "maxValue" })
              }
            />
          </FlexController>
          <FlexController contain={80}>
            <Slider
              {...minMaxProps}
              step={isFloatingPoint ? 0.1 : 1}
              value={isDouble ? [minValue, maxValue] : maxValue}
              defaultValue={isDouble ? min : [min, max]}
              onChange={(value) => changeValue({ value, key: null })}
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
                  value={isDouble ? [minValue, maxValue] : maxValue}
                  defaultValue={isDouble ? min : [min, max]}
                  onChange={(value) => changeValue({ value, key: null })}
                />
              </RangeWrapper>
            </FlexController>
          </FlexContainer>
          <FlexContainer row={true}>
            <FlexController contain={50} constrainElement={40}>
              <Input
                {...minMaxProps}
                value={minValue}
                type={dateType ? "date" : "number"}
                name="options-limit-min"
                onChange={(e) =>
                  changeValue({ value: e.target.value, key: "minValue" })
                }
              />
            </FlexController>
            <FlexController
              contain={50}
              constrainElement={40}
              alignment="right"
            >
              <Input
                {...minMaxProps}
                value={maxValue}
                type={dateType ? "date" : "number"}
                name="options-limit-max"
                onChange={(e) =>
                  changeValue({ value: e.target.value, key: "maxValue" })
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
