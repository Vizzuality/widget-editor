import React from "react";
import styled, { ThemeProvider } from "styled-components";
import ReactSlider from "react-slider";

const StyledSlider = styled(ReactSlider)`
  height: 7px;
  width: inherit;
`;

const StyledThumb = styled.div`
  height: 18px;
  line-height: 18px;
  width: 18px;
  background-color: #fff;
  border: 3px solid ${props => props.theme.slider.track};
  border-radius: 50%;
  transform: translateY(-50%);
  top: 50%;
  cursor: grab;
`;

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${props =>
    props.index === 2
      ? props.theme.slider.track
      : props.index === 1
      ? props.theme.slider.trackBackground
      : props.theme.slider.track};
  border-radius: 999px;
`;

const Thumb = (props, state) => <StyledThumb {...props} index={state.index} />;
const Track = (props, state) => {
  return (
    <StyledTrack {...props} index={state.index} />
  );
};

const Slider = ({
  min = 1,
  max = 500,
  value,
  defaultValue,
  theme,
  onChange = () => {},
  onDone = () => {},
}) => {

  const isArray = Array.isArray(value);

  return (
    <ThemeProvider theme={theme}>
      <StyledSlider
        onAfterChange={onDone}
        onChange={onChange}
        renderTrack={Track}
        renderThumb={Thumb}
        value={value}
        defaultValue={defaultValue}
        max={max}
        min={min}
        isArray={isArray}
      />
    </ThemeProvider>
  );
};

export default Slider;
