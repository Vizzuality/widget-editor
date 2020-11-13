import React from "react";
import PropTypes from 'prop-types';
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

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  theme: PropTypes.object,
  onChange: PropTypes.func,
  onDone: PropTypes.func,
}

export default Slider;
