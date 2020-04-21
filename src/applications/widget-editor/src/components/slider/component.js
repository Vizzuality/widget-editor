import React from "react";
import styled, { ThemeProvider } from "styled-components";
import ReactSlider from "react-slider";

const StyledSlider = styled(ReactSlider)`
  height: 4px;
  width: inherit;
  background: ${(props) =>
    props.array ? "transparent" : props.theme.slider.track};
`;

const StyledThumb = styled.div`
  height: 18px;
  line-height: 18px;
  width: 18px;
  background-color: #fff;
  border: 3px solid ${(props) => props.theme.slider.track};
  border-radius: 50%;
  transform: translateY(-50%);
  z-index: 0 !important;
  top: 50%;
  cursor: grab;
`;

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${(props) => {
    if (props.isArray) {
      return props.isArray && props.index === 1
        ? props.theme.slider.track
        : props.theme.slider.trackBackground;
    } else {
      return props.index === 2
        ? props.theme.slider.track
        : props.index === 1
        ? props.theme.slider.trackBackground
        : props.theme.slider.track;
    }
  }};
  border-radius: 999px;
`;

const Thumb = (props, state) => <StyledThumb {...props} />;
const Track = (props, state) => (
  <StyledTrack
    {...props}
    isArray={Array.isArray(state.value)}
    index={state.index}
  />
);

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
  return (
    <ThemeProvider theme={theme}>
      <StyledSlider
        onAfterChange={onDone}
        onChange={onChange}
        renderTrack={Track}
        renderThumb={Thumb}
        value={value}
        step={step}
        defaultValue={defaultValue}
        max={max}
        min={min}
      />
    </ThemeProvider>
  );
};

export default Slider;
