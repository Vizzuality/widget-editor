function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from "react";
import styled, { css } from "styled-components";
const StyledButton = styled.button.withConfig({
  displayName: "component__StyledButton",
  componentId: "l5yyzu-0"
})(["cursor:pointer;font-size:16px;color:#393f44;border:1px solid rgba(202,204,208,0.85);background:transparent;padding:10px 20px;border-radius:5px;outline:1;", " ", " ", " ", " ", ""], props => props.size && props.size === "small" && css(["padding:7px 15px;"]), props => props.type && props.type === "cta" && css(["background:", ";color:#fff;border:1px solid transparent;"], props.color), props => props.type && props.type === "highlight" && css(["color:", ";border:1px solid ", ";"], props.color, props.color), props => props.type && props.type === "default" && css(["&:hover,&.active{", "}"], props => props.color && css(["border:1px solid ", ";color:", ";"], props.color, props.color)), props => props.active && css(["border:1px solid ", ";color:", ";"], props.color, props.color));

const Button = ({
  type = "default",
  theme,
  children,
  ...props
}) => {
  return React.createElement(StyledButton, _extends({}, props, {
    color: theme.color,
    type: type
  }), children);
};

export default Button;