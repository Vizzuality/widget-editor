import React from "react";
import styled, { ThemeProvider } from "styled-components";
import ReactSlider from "react-slider";

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 7px;
  flex-basis: 70%;
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

const Thumb = (props, state) => <StyledThumb {...props} />;
const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

const Slider = ({
  min = 1,
  max = 500,
  defaultValue = 500,
  value,
  theme,
  onDone,
  onChange
}) => {
  return (
    <ThemeProvider theme={theme}>
      <StyledSlider
        onAfterChange={onDone}
        onChange={onChange}
        renderTrack={Track}
        renderThumb={Thumb}
        value={Number(value)}
        max={max}
        min={min}
        defaultValue={defaultValue}
      />
    </ThemeProvider>
  );
};

export default Slider;
