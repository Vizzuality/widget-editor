function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import styled from 'styled-components';
const Icon = styled.svg.withConfig({
  displayName: "CloseIcon__Icon",
  componentId: "xts4iy-0"
})(["&:hover{path{fill:", ";}}"], props => (props.hoverColor ? props.hoverColor : '#C32D7B') || 'auto');

const CloseIcon = props => React.createElement(Icon, _extends({}, props, {
  viewBox: "0 0 32 32"
}), React.createElement("path", {
  d: "M16 11.636l-11.636-11.636-4.364 4.364 11.636 11.636-11.636 11.636 4.364 4.364 11.636-11.636 11.636 11.636 4.364-4.364-11.636-11.636 11.636-11.636-4.364-4.364z"
}));

export default CloseIcon;