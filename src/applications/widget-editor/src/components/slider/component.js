import React from "react";
import styled, { ThemeProvider } from "styled-components";
import RcSlider, { Range } from "rc-slider";

import rcSliderStyles from "./rc-slider";

const StyledSlider = styled.div`
  width: 100%;
  .slider {
    position: relative;
    height: 4px;
    width: 100%;
    background: ${(props) => props.theme.slider.track};
  }
  ${rcSliderStyles}
`;

const Slider = ({
  min = 1,
  max = 500,
  step = 1,
  value,
  defaultValue,
  theme,
  onChange = () => {},
  onDone = () => {},
}) => {
  const isRange = Array.isArray(value);

  return (
    <ThemeProvider theme={theme}>
      <StyledSlider>
        {isRange && (
          <Range
            value={value}
            step={step}
            min={min}
            max={max}
            handleStyle={{
              width: "20px",
              height: "20px",
              top: "2px",
            }}
            onChange={onChange}
            onDone={onDone}
          />
        )}
        {!isRange && (
          <RcSlider
            onAfterChange={onDone}
            onChange={onChange}
            handleStyle={{
              width: "20px",
              height: "20px",
              top: "2px",
            }}
            value={value}
            step={step}
            max={max}
            min={min}
          />
        )}
      </StyledSlider>
    </ThemeProvider>
  );
};

export default Slider;
