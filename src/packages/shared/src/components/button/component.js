import React from "react";
import styled, { css } from "styled-components";

const StyledButton = styled.button`
  padding: 10px 20px;
  font-family: inherit;
  font-size: 16px;
  color: #393f44;
  border-radius: 5px;
  border: 1px solid rgba(202, 204, 208, 0.85);
  background: transparent;
  cursor: pointer;

  &:hover:not([disabled]),
  &:focus:not([disabled]),
  &:active:not([disabled]),
  &[aria-pressed = "true"]:not([disabled]) {
    ${(props) => props.color && css`
      border: 1px solid ${props.color};
      color: ${props.color};
      outline: none;
    `}
  }

  ${(props) => props.size && props.size === "small" && css`
    padding: 7px 15px;
  `}

  ${(props) => props.btnType && props.btnType === "highlight" && css`
    color: ${props.color};
    border: 1px solid ${props.color};

    &:hover:not([disabled]),
    &:focus:not([disabled]),
    &:active:not([disabled]),
    &[aria-pressed = "true"]:not([disabled]) {
      box-shadow: 0 0 0px 3px rgba(195, 45, 123, 0.3);
    }
  `}

  ${(props) => props.btnType && props.btnType === "cta" && css`
    color: #fff;
    background: ${props.color};
    border: 1px solid ${props.color};

    &:hover:not([disabled]),
    &:focus:not([disabled]),
    &:active:not([disabled]),
    &[aria-pressed = "true"]:not([disabled]) {
      color: #fff;
      box-shadow: 0 0 0px 3px rgba(195, 45, 123, 0.3);
    }
  `}

  &[disabled] {
    opacity: 0.5;
    pointer: default;
  }
`;

const Button = ({ type, btnType = "default", theme, children, active, ...props }) => {
  return (
    <StyledButton
      {...props}
      color={theme.color}
      type="button"
      role="button"
      btnType={btnType}
      {...(typeof active === 'boolean'
        ? { 'aria-pressed': active }
        : {}
      )}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
