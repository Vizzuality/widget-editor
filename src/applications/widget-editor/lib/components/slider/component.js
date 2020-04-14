function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from "react";
import styled, { ThemeProvider } from "styled-components";
import ReactSlider from "react-slider";
const StyledSlider = styled(ReactSlider).withConfig({
  displayName: "component__StyledSlider",
  componentId: "omz0xx-0"
})(["height:4px;width:inherit;background:", ";"], props => props.array ? "transparent" : props.theme.slider.track);
const StyledThumb = styled.div.withConfig({
  displayName: "component__StyledThumb",
  componentId: "omz0xx-1"
})(["height:18px;line-height:18px;width:18px;background-color:#fff;border:3px solid ", ";border-radius:50%;transform:translateY(-50%);z-index:0 !important;top:50%;cursor:grab;"], props => props.theme.slider.track);
const StyledTrack = styled.div.withConfig({
  displayName: "component__StyledTrack",
  componentId: "omz0xx-2"
})(["top:0;bottom:0;background:", ";border-radius:999px;"], props => {
  if (props.isArray) {
    return props.isArray && props.index === 1 ? props.theme.slider.track : props.theme.slider.trackBackground;
  } else {
    return props.index === 2 ? props.theme.slider.track : props.index === 1 ? props.theme.slider.trackBackground : props.theme.slider.track;
  }
});

const Thumb = (props, state) => React.createElement(StyledThumb, props);

const Track = (props, state) => React.createElement(StyledTrack, _extends({}, props, {
  isArray: Array.isArray(state.value),
  index: state.index
}));

const Slider = ({
  min = 1,
  max = 500,
  step = 1,
  value,
  defaultValue,
  theme,
  onChange = () => {},
  onDone = () => {}
}) => {
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(StyledSlider, {
    onAfterChange: onDone,
    onChange: onChange,
    renderTrack: Track,
    renderThumb: Thumb,
    value: value,
    step: step,
    defaultValue: defaultValue,
    max: max,
    min: min
  }));
};

export default Slider;